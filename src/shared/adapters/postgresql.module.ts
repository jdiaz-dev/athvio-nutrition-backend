import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { POSTGRES_DB, POSTGRES_POOL } from 'src/shared/adapters/database/postgresql/postgresql.constants';

export type PostgresDb = NodePgDatabase;

@Global()
@Module({
  providers: [
    {
      provide: POSTGRES_POOL,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Pool =>
        new Pool({
          connectionString: configService.getOrThrow<string>('POSTGRES_DB_CONNECTION'),
          max: 20,
        }),
    },
    {
      provide: POSTGRES_DB,
      inject: [POSTGRES_POOL],
      useFactory: (pool: Pool): PostgresDb => drizzle(pool),
    },
  ],
  exports: [POSTGRES_DB],
})
export class PostgreSqlModule implements OnApplicationShutdown {
  constructor(@Inject(POSTGRES_POOL) private readonly pool: Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
