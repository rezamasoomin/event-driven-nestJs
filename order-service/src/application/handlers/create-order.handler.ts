import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../../domain/commands/create-order.command';
import { OrderAggregate } from '../../domain/aggregates/order.aggregate';
import { EventStore } from '../../infrastructure/persistence/event-store';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';

// First, create a Result class
class Result<T> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: string,
  ) {}

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get value(): T {
    return this._value;
  }

  get error(): string {
    return this._error;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, null, error);
  }
}

@Injectable()
@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  private readonly logger = new Logger(CreateOrderHandler.name);

  constructor(
    private readonly eventStore: EventStore,
    private readonly eventBus: EventBus,
  ) {}

  private validateCommand(command: CreateOrderCommand): boolean {
    if (!command.userId) return false;
    if (
      !command.items ||
      !Array.isArray(command.items) ||
      command.items.length === 0
    )
      return false;

    // Validate each item in the order
    return command.items.every(
      (item) => item.quantity > 0 && item.price >= 0 && item.productId,
    );
  }

  async execute(command: CreateOrderCommand): Promise<Result<string>> {
    try {
      const orderId = uuidv4();
      const orderAggregate = new OrderAggregate(orderId);

      // Validate command
      if (!this.validateCommand(command)) {
        return Result.fail('Invalid command data');
      }

      // Create order
      orderAggregate.createOrder(command.userId, command.items);

      // Save events
      const events = orderAggregate.getUncommittedEvents();
      await this.eventStore.save(orderId, events);

      // Publish events
      events.forEach((event) => this.eventBus.publish(event));

      return Result.ok(orderId);
    } catch (error) {
      // Log error
      this.logger.error(`Failed to create order: ${error.message}`);
      return Result.fail(error.message);
    }
  }
}
