export type Neo4jScheme = 'neo4j' | 'neo4j+s' | 'neo4j+ssc' | 'bolt' | 'bolt+s' | 'bolt+ssc';

export type Neo4jConfig = {
  database: string;
  scheme: Neo4jScheme;
  host: string;
  port: number | string;
  username: string;
  password: string;
};
