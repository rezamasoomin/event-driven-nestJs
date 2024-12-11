export interface OrderCreatedPayload {
    orderId: string;
    userId: string;
    products: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    status: OrderStatus;
}
export interface OrderCreatedEvent extends DomainEvent<OrderCreatedPayload> {
    metadata: EventMetadata & {
      version: '1.0';
      eventType: 'OrderCreated';
    };
  }
}