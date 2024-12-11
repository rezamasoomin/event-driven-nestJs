import { OrderItem, OrderStatus } from 'src/domain/interfaces/order.interface';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('orders')
export class OrderWriteModel {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column('json')
  items: OrderItem[];

  @Column('decimal')
  totalAmount: number;

  @Column('enum')
  status: OrderStatus;
}
