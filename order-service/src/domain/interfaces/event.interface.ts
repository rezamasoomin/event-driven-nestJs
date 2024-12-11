import { IEvent } from '@nestjs/cqrs';

export interface BaseEvent extends IEvent {
  payload: {
    id: string;
    [key: string]: any;
  };
  metadata: EventMetadata;
}
export function isDomainEvent(event: IEvent): event is BaseEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'payload' in event &&
    'metadata' in event &&
    typeof (event as any).payload === 'object' &&
    typeof (event as any).payload.id === 'string'
  );
}
export interface EventMetadata {
  eventId?: string;
  eventType?: string;
  timestamp?: string;
  correlationId?: string;
  causationId?: string;
  version?: string;
}
