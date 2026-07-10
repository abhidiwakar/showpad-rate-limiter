export interface ClientConfig {
  name: string;
  id: string;
  rateLimit: {
    bucketCapacity: number;
    refillRate: number;
  };
}
