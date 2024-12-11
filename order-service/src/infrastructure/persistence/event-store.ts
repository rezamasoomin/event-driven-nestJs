import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventStore {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly logger: Logger,
  ) {}

  async save(orderId: string, events: any[]): Promise<void> {
    const queryRunner =
      this.eventRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const event of events) {
        console.log('event', event);
        const eventEntity = new EventEntity();
        eventEntity.aggregateId = event.order.orderId || event.order.id; // Use orderId or id from payload
        eventEntity.eventType = event.constructor.name;
        eventEntity.version = '1.0';
        eventEntity.order = event.order;
        eventEntity.metadata = {
          timestamp: new Date().toISOString(),
          eventId: uuidv4(),
          correlationId: uuidv4(),
        };

        await queryRunner.manager.save(eventEntity);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error('Failed to save events', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getEventsByAggregateId(aggregateId: string): Promise<EventEntity[]> {
    return this.eventRepository.find({
      where: { aggregateId },
      order: { createdAt: 'ASC' },
    });
  }
}
