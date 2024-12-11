import { v4 as uuidv4 } from 'uuid';
import { EventMetadata } from '../interfaces/event.interface';

export class EventUtils {
    static createMetadata(
        eventType: string,
        version: string,
        correlationId?: string,
        causationId?: string,
    ): EventMetadata {
        return {
            eventId: uuidv4(),
            eventType,
            version,
            timestamp: new Date().toISOString(),
            correlationId: correlationId || uuidv4(),
            causationId: causationId || null,
        };
    }
}