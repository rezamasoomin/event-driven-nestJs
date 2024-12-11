import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderCreatedEvent } from '../../domain/events/order-created.event';

@Injectable()
export class OrderSaga {
  @Saga()
  orderCreated = (events$: Observable<any>): Observable<any> => {
    return events$.pipe(
      ofType(OrderCreatedEvent),
      map((event) => {
        console.log('Order Created Saga', event);
        // Here you can return new commands based on the event
        return null;
      }),
    );
  };
}
