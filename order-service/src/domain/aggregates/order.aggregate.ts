import { AggregateRoot } from '@nestjs/cqrs';
import { Order, OrderStatus, OrderItem } from '../interfaces/order.interface';
import { OrderCreatedEvent } from '../events/order-created.event';

export class OrderAggregate extends AggregateRoot {
  private _id: string;
  private _userId: string;
  private _items: OrderItem[];
  private _totalAmount: number;
  private _status: OrderStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(id: string) {
    super();
    this._id = id;
  }

  createOrder(userId: string, items: OrderItem[]) {
    const totalAmount = this.calculateTotalAmount(items);

    const order: Order = {
      id: this._id,
      userId,
      items,
      totalAmount,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Order created', order);
    const event = new OrderCreatedEvent(this._id, order);
    this.apply(event);
  }

  private calculateTotalAmount(items: OrderItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Add this method to handle OrderCreatedEvent
  onOrderCreatedEvent(event: OrderCreatedEvent) {
    this._id = event.order.id;
    this._userId = event.order.userId;
    this._items = event.order.items;
    this._totalAmount = event.order.totalAmount;
    this._status = event.order.status;
    this._createdAt = event.order.createdAt;
    this._updatedAt = event.order.updatedAt;
  }
}
