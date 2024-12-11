export namespace OrderCommands {
    export interface CreateOrderPayload {
        userId: string;
        products: Array<{
            productId: string;
            quantity: number;
        }>;
    }

    export interface CreateOrderCommand extends DomainEvent<CreateOrderPayload> {
        metadata: EventMetadata & {
            version: '1.0';
            eventType: 'CreateOrder';
        };
    }
}