import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from './infrastructure/messaging/kafka/kafka.module';
import { EventEntity } from './infrastructure/persistence/entities/event.entity';
import { OrderModule } from './order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'ZXCzxc-123',
      database: 'eventstore',
      entities: [EventEntity],
      synchronize: true, // set to false in production
      logging: true,
      driver: require('mysql2'),
      charset: 'utf8mb4',
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
    }),
    KafkaModule,
    OrderModule,
  ],
})
export class AppModule {}
