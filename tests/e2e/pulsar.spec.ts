import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Server } from 'http';
import { MULTIPLE_PUBSUB_RESPONSE, PUBSUB_RESPONSE } from '../src/constants';
import { AppModule } from '../src/app.module';
import { AsyncAppModule } from '../src/async-app.module';
import { MultipleClientsAppModule } from '../src/multiple-clients-app.module';
import { NamedClientAppModule } from '../src/named-client-app.module';
import { AppClientOnlyModule } from '../src/app-client-only.module';

describe('Pulsar', () => {
  let server: Server;
  let app: INestApplication;

  afterEach(async () => {
    await app.close();
  });

  describe('publish message then get it from consumer & reader', () => {
    it(`should support sync injection`, async () => {
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = module.createNestApplication();
      server = app.getHttpServer();
      await app.init();

      await request(server).get('/pubsub').expect(200, PUBSUB_RESPONSE);
    });

    it('should support async injection', async () => {
      const module = await Test.createTestingModule({
        imports: [AsyncAppModule],
      }).compile();

      app = module.createNestApplication();
      server = app.getHttpServer();
      await app.init();

      await request(server).get('/pubsub').expect(200, PUBSUB_RESPONSE);
    });

    it('should support named client', async () => {
      const module = await Test.createTestingModule({
        imports: [NamedClientAppModule],
      }).compile();

      app = module.createNestApplication();
      server = app.getHttpServer();
      await app.init();

      await request(server).get('/pubsub').expect(200, PUBSUB_RESPONSE);
    });

    it('should support multiples clients', async () => {
      const module = await Test.createTestingModule({
        imports: [MultipleClientsAppModule],
      }).compile();

      app = module.createNestApplication();
      server = app.getHttpServer();
      await app.init();

      await request(server)
        .get('/pubsub')
        .expect(200, MULTIPLE_PUBSUB_RESPONSE);
    });

    it('should support re-exporting Producer, Consumer or Client from outside module', async () => {
      const module = await Test.createTestingModule({
        imports: [AppClientOnlyModule],
      }).compile();

      app = module.createNestApplication();
      server = app.getHttpServer();
      await app.init();

      await request(server).get('/pubsub').expect(200, PUBSUB_RESPONSE);
    });
  });
});
