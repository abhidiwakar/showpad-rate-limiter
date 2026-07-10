import { ClientConfig } from './client-config';

export {};

declare global {
  namespace Express {
    export interface Request {
      consumer?: ClientConfig;
    }
  }
}
