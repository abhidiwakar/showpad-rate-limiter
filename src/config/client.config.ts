import { ClientConfig } from 'src/@types/client-config';

export const clientConfig: ClientConfig[] = [
  {
    name: 'Client 1',
    id: 'client-1',
    rateLimit: {
      bucketCapacity: 30,
      refillRate: 0.5,
    },
  },
  {
    name: 'Client 2',
    id: 'client-2',
    rateLimit: {
      bucketCapacity: 60,
      refillRate: 1,
    },
  },
];
