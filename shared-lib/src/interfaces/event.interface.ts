export interface EventMetadata {
    eventId: string;
    eventType: string;
    version: string;
    timestamp: string;
    correlationId: string;
    causationId: string | null;
    userId?: string;
}

export interface DomainEvent<T = any> {
    metadata: EventMetadata;
    payload: T;
}