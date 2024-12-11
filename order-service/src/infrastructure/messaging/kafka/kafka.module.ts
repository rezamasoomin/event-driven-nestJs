import { Logger, Module } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import {
  CommandBus,
  CqrsModule,
  EventBus,
  UnhandledExceptionBus,
} from '@nestjs/cqrs';
import { KafkaEventBus } from './kafka-event-bus';
import {
  CircuitBreaker,
  SimpleCircuitBreaker,
} from '../../common/circuit-breaker';
import { CIRCUIT_BREAKER } from '../../common/circuit-breaker';
import { ModuleRef } from '@nestjs/core';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'order-service',
              brokers: ['kafka:9092'],
            },
            consumer: {
              groupId: 'order-consumer-group',
            },
          },
        }),
      },
    ]),
  ],
  providers: [
    {
      provide: CIRCUIT_BREAKER,
      useClass: SimpleCircuitBreaker,
    },
    {
      provide: EventBus,
      useFactory: (
        kafkaClient: ClientKafka,
        circuitBreaker: CircuitBreaker,
        logger: Logger,
        commandBus: CommandBus,
        moduleRef: ModuleRef,
        unhandledExceptionBus: UnhandledExceptionBus,
      ) => {
        return new KafkaEventBus(
          kafkaClient,
          circuitBreaker,
          logger,
          commandBus,
          moduleRef,
          unhandledExceptionBus,
        );
      },
      inject: [
        'KAFKA_SERVICE',
        CIRCUIT_BREAKER,
        Logger,
        CommandBus,
        ModuleRef,
        UnhandledExceptionBus,
      ],
    },
    Logger,
  ],
  exports: [EventBus, ClientsModule],
})
export class KafkaModule {}
