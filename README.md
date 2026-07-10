# Showpad Rate Limiter

This NestJS project demonstrates two rate-limiting approaches:

- /foo uses an in-memory rate limiter
- /bar uses a database-backed rate limiter

## Prerequisites

- Node.js 18+
- npm

## Install dependencies

```bash
npm install
```

## Run the project

```bash
npm run start:dev
```

The app will start on http://localhost:3000.

## Test the endpoints

The API requires a client ID in the Authorization header using the Bearer scheme.

### Test /foo

```bash
curl -i -H "Authorization: Bearer client-1" http://localhost:3000/foo
```

### Test /bar

```bash
curl -i -H "Authorization: Bearer client-2" http://localhost:3000/bar
```

You can repeat the requests several times to observe the rate-limit behavior.

## Configure clients and limits

If you want to change the client rate-limit values or add more clients, update [src/config/client.config.ts](src/config/client.config.ts). Each client entry can define:

- name
- id
- rateLimit.bucketCapacity
- rateLimit.refillRate

## Run tests

```bash
npm run test:e2e
```
