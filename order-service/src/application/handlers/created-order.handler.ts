import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderCreatedEvent } from 'src/domain/events/order-created.event';
import { OrderReadModel } from 'src/infrastructure/persistence/entities/order.view.entity';
import { Repository, Logger } from 'typeorm';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedHandler implements IEventHandler<OrderCreatedEvent> {
  constructor(
    @InjectRepository(OrderReadModel)
    private readonly orderRepository: Repository<OrderReadModel>,
    private readonly logger: Logger,
  ) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    const queryRunner =
      this.orderRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if event was already processed (idempotency)
      const exists = await queryRunner.manager.findOne(OrderReadModel, {
        where: { id: event.order.id },
      });

      if (exists) {
        console.log(`Event ${event.order.id} already processed`);
        return;
      }

      const orderView = new OrderReadModel();
      orderView.id = event.order.id;
      orderView.userId = event.order.userId;
      orderView.items = event.order.items;
      orderView.totalAmount = event.order.totalAmount;
      orderView.status = event.order.status;

      await queryRunner.manager.save(orderView);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(`Failed to handle OrderCreatedEvent: ${error.message}`);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
