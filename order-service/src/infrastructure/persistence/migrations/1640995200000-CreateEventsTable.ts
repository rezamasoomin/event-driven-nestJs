import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEventsTable1640995200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'events',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'aggregateId',
            type: 'varchar',
          },
          {
            name: 'eventType',
            type: 'varchar',
          },
          {
            name: 'version',
            type: 'varchar',
          },
          {
            name: 'payload',
            type: 'jsonb',
          },
          {
            name: 'metadata',
            type: 'jsonb',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        indices: [
          {
            name: 'IDX_EVENTS_AGGREGATE_ID',
            columnNames: ['aggregateId'],
          },
          {
            name: 'IDX_EVENTS_EVENT_TYPE',
            columnNames: ['eventType'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('events');
  }
}
