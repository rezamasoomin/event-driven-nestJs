import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { EventStore } from './event-store';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  providers: [EventStore, Logger],
  exports: [EventStore],
})
export class PersistenceModule {}
