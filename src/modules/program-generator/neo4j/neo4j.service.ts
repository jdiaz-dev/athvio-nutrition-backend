import neo4j, { Result, Driver, int, Transaction } from 'neo4j-driver';
import { Injectable, Inject, OnApplicationShutdown, InternalServerErrorException } from '@nestjs/common';
import { NEO4J_CONFIG, NEO4J_DRIVER } from 'src/modules/program-generator/shared/constants';
import { Neo4jConfig } from 'src/modules/program-generator/shared/types.d';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { LayersServer } from 'src/shared/enums/project';
import { InternalErrors } from 'src/shared/enums/messages-response';

@Injectable()
export class Neo4jService implements OnApplicationShutdown {
  constructor(
    @Inject(NEO4J_CONFIG) private readonly config: Neo4jConfig,
    @Inject(NEO4J_DRIVER) private readonly driver: Driver,
    private readonly logger: AthvioLoggerService,
  ) {}

  getDriver(): Driver {
    return this.driver;
  }

  getConfig(): Neo4jConfig {
    return this.config;
  }

  int(value: number) {
    return int(value);
  }

  beginTransaction(database?: string): Transaction {
    const session = this.getWriteSession(database);

    return session.beginTransaction();
  }

  getReadSession(database?: string) {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: neo4j.session.READ,
    });
  }

  getWriteSession(database?: string) {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: neo4j.session.WRITE,
    });
  }

  async read(cypher: string, params?: Record<string, any>, databaseOrTransaction?: string | Transaction): Promise<Result> {
    try {
      if (databaseOrTransaction instanceof Transaction) {
        return (<Transaction>databaseOrTransaction).run(cypher, params);
      }

      const session = this.getReadSession(<string>databaseOrTransaction);
      return await session.run(cypher, params);
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, message: (error as Error).message, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  async write(cypher: string, params?: Record<string, any>, databaseOrTransaction?: string | Transaction): Promise<Result> {
    try {
      if (databaseOrTransaction instanceof Transaction) {
        return (<Transaction>databaseOrTransaction).run(cypher, params);
      }

      const session = this.getWriteSession(<string>databaseOrTransaction);
      return await session.run(cypher, params);
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, message: (error as Error).message, error });
      throw new InternalServerErrorException(InternalErrors.DATABASE);
    }
  }

  onApplicationShutdown() {
    return this.driver.close();
  }
}
