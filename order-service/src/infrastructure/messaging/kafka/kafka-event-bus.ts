import { Inject, Injectable } from '@nestjs/common';
import {
  CommandBus,
  EventBus,
  IEvent,
  UnhandledExceptionBus,
} from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { CIRCUIT_BREAKER, CircuitBreaker } from '../../common/circuit-breaker';
import { KAFKA_TOPICS } from './kafka-topics';
import { OrderCreatedEvent } from '../../../domain/events/order-created.event';

import { ModuleRef } from '@nestjs/core';
import {
  EventMetadata,
  isDomainEvent,
} from 'src/domain/interfaces/event.interface';

@Injectable()
export class KafkaEventBus extends EventBus {
  constructor(
    private readonly kafkaClient: ClientKafka,
    @Inject(CIRCUIT_BREAKER) private readonly circuitBreaker: CircuitBreaker,
    private readonly logger: Logger,
    commandBus: CommandBus,
    moduleRef: ModuleRef,
    unhandledExceptionBus: UnhandledExceptionBus,
  ) {
    super(commandBus, moduleRef, unhandledExceptionBus);
  }

  async publish<TEvent extends IEvent>(event: TEvent) {
    await super.publish(event);
    await this.publishToKafka(event);
  }

  private async publishToKafka(event: IEvent): Promise<void> {
    const topic = this.getTopicForEvent(event);
    if (!topic) {
      return;
    }

    try {
      await this.circuitBreaker.fire(async () => {
        await this.kafkaClient.emit(topic, {
          key: this.getEventKey(event),
          value: this.serializeEvent(event),
          headers: this.getEventHeaders(event),
        });
      });
    } catch (error) {
      this.logger.error(
        `Failed to publish event ${event.constructor.name}`,
        error.stack,
      );
      await this.handleFailedEvent(event, error);
    }
  }

  private getTopicForEvent(event: IEvent): string | null {
    if (event instanceof OrderCreatedEvent) {
      return KAFKA_TOPICS.ORDERS.CREATED;
    }
    // Add more event type mappings here
    return null;
  }

  private getEventKey(event: IEvent): string {
    if (isDomainEvent(event)) {
      return event.payload.id;
    }
    return crypto.randomUUID();
  }

  private serializeEvent(event: IEvent): any {
    if ('payload' in event && 'metadata' in event) {
      return {
        payload: event['payload'],
        metadata: event['metadata'],
      };
    }
    return event;
  }

  private getEventHeaders(event: IEvent): Record<string, string> {
    const headers: Record<string, string> = {
      'event-type': event.constructor.name,
    };

    if ('metadata' in event) {
      const metadata: EventMetadata = event['metadata'];
      if (metadata.correlationId) {
        headers['correlation-id'] = metadata.correlationId;
      }
      if (metadata.causationId) {
        headers['causation-id'] = metadata.causationId;
      }
    }

    return headers;
  }

  private async handleFailedEvent(event: IEvent, error: Error): Promise<void> {
    try {
      await this.kafkaClient.emit('dead-letter-queue', {
        event: this.serializeEvent(event),
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    } catch (dlqError) {
      this.logger.error(
        'Failed to publish to dead letter queue',
        dlqError.stack,
      );
    }
  }
}
