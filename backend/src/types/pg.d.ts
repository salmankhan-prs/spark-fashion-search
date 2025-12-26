declare module "pg" {
  export class Pool {
    constructor(config?: {
      connectionString?: string;
      host?: string;
      port?: number;
      database?: string;
      user?: string;
      password?: string;
      max?: number;
      idleTimeoutMillis?: number;
      connectionTimeoutMillis?: number;
    });
    query<T = any>(text: string, values?: any[]): Promise<{ rows: T[]; rowCount: number }>;
    connect(): Promise<PoolClient>;
    end(): Promise<void>;
  }

  export interface PoolClient {
    query<T = any>(text: string, values?: any[]): Promise<{ rows: T[]; rowCount: number }>;
    release(err?: Error): void;
  }

  export class Client {
    constructor(config?: {
      connectionString?: string;
      host?: string;
      port?: number;
      database?: string;
      user?: string;
      password?: string;
    });
    connect(): Promise<void>;
    query<T = any>(text: string, values?: any[]): Promise<{ rows: T[]; rowCount: number }>;
    end(): Promise<void>;
  }
}

