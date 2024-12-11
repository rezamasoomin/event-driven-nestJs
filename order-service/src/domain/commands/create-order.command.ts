import { ICommand } from '@nestjs/cqrs';
import { OrderItem } from '../interfaces/order.interface';

export class CreateOrderCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly items: OrderItem[],
  ) {}
}
