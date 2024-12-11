import { OrderItem, OrderStatus } from 'src/domain/interfaces/order.interface';
import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('order_views')
export class OrderReadModel {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column('json')
  items: OrderItem[];

  // Additional fields for querying
  @Column()
  itemCount: number;

  @Column('decimal')
  totalAmount: number;

  @Column('enum')
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;
}
