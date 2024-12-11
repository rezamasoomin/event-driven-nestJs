import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  aggregateId: string;

  @Column()
  eventType: string;

  @Column()
  version: string;

  @Column('json')
  order: any;

  @Column('json')
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;
}
