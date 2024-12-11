import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { KafkaModule } from './infrastructure/messaging/kafka/kafka.module';
import { CreateOrderHandler } from './application/handlers/create-order.handler';
import { OrderSaga } from './application/sagas/order.saga';
import { OrderController } from './api/controllers/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './infrastructure/persistence/entities/event.entity';
import { EventStore } from './infrastructure/persistence/event-store';

const CommandHandlers = [CreateOrderHandler];
const EventHandlers = [];
const Sagas = [OrderSaga];

@Module({
  imports: [CqrsModule, KafkaModule, TypeOrmModule.forFeature([EventEntity])],
  controllers: [OrderController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...Sagas,
    CreateOrderHandler,
    EventStore,
    Logger,
  ],
})
export class OrderModule {}
