import { IEvent } from '@nestjs/cqrs';
import { OrderItem, OrderStatus } from '../interfaces/order.interface';

export class OrderCreatedEvent implements IEvent {
  constructor(
    public readonly orderId: string,
    public readonly order: {
      id: string;
      userId: string;
      items: OrderItem[];
      totalAmount: number;
      status: OrderStatus;
      createdAt: Date;
      updatedAt: Date;
    },
    public readonly timestamp: Date = new Date(),
  ) {}
}
