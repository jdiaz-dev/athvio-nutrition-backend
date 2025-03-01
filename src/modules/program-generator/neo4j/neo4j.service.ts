import neo4j, { Result, Driver, int, Transaction } from 'neo4j-driver';
import { Injectable, Inject, OnApplicationShutdown } from '@nestjs/common';
import { NEO4J_CONFIG, NEO4J_DRIVER } from 'src/modules/program-generator/shared/constants';
import { Neo4jConfig } from 'src/modules/program-generator/shared/types';

@Injectable()
export class Neo4jService implements OnApplicationShutdown {
  constructor(
    @Inject(NEO4J_CONFIG) private readonly config: Neo4jConfig,
    @Inject(NEO4J_DRIVER) private readonly driver: Driver,
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
      database: database || this.config.scheme,
      defaultAccessMode: neo4j.session.READ,
    });
  }

  getWriteSession(database?: string) {
    return this.driver.session({
      database: database || this.config.scheme,
      defaultAccessMode: neo4j.session.WRITE,
    });
  }

  read(cypher: string, params?: Record<string, any>, databaseOrTransaction?: string | Transaction): Result {
    if (databaseOrTransaction instanceof Transaction) {
      return (<Transaction>databaseOrTransaction).run(cypher, params);
    }

    const session = this.getReadSession(<string>databaseOrTransaction);
    return session.run(cypher, params);
  }

  write(cypher: string, params?: Record<string, any>, databaseOrTransaction?: string | Transaction): Result {
    if (databaseOrTransaction instanceof Transaction) {
      return (<Transaction>databaseOrTransaction).run(cypher, params);
    }

    const session = this.getWriteSession(<string>databaseOrTransaction);
    return session.run(cypher, params);
  }

  onApplicationShutdown() {
    return this.driver.close();
  }
}
