import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { clientConfig } from '../src/config/client.config';
import { AppModule } from './../src/app.module';

describe('Foo and Bar endpoints (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns 200 for /foo with a valid client token', async () => {
    await request(app.getHttpServer())
      .get('/foo')
      .set('Authorization', 'Bearer client-1')
      .expect(200)
      .expect({ success: true });
  });

  it('returns 200 for /bar with a valid client token', async () => {
    await request(app.getHttpServer())
      .get('/bar')
      .set('Authorization', 'Bearer client-2')
      .expect(200)
      .expect({ success: true });
  });

  it('returns 429 for /foo when the rate limit is exceeded', async () => {
    const clientOne = clientConfig.find((client) => client.id === 'client-1');

    if (!clientOne) {
      throw new Error('client-1 not found in client config');
    }

    for (let i = 0; i < clientOne.rateLimit.bucketCapacity; i += 1) {
      await request(app.getHttpServer())
        .get('/foo')
        .set('Authorization', 'Bearer client-1')
        .expect(200);
    }

    await request(app.getHttpServer())
      .get('/foo')
      .set('Authorization', 'Bearer client-1')
      .expect(429)
      .expect({ error: 'rate limit exceeded' });
  });

  it('returns 401 for /foo when no auth header is provided', async () => {
    await request(app.getHttpServer()).get('/foo').expect(401);
  });

  it('returns 401 for /bar when an invalid client id is supplied', async () => {
    await request(app.getHttpServer())
      .get('/bar')
      .set('Authorization', 'Bearer invalid-client')
      .expect(401);
  });
});
