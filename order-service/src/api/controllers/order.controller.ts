import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../../domain/commands/create-order.command';

@Controller('orders')
export class OrderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createOrder(
    @Body()
    createOrderDto: {
      userId: string;
      items: Array<{
        productId: string;
        quantity: number;
        price: number;
      }>;
    },
  ) {
    const command = new CreateOrderCommand(
      createOrderDto.userId,
      createOrderDto.items,
    );
    return this.commandBus.execute(command);
  }
}
