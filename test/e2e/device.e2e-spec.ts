import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('Device CRUD (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdDeviceId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Register and login to get access token
    const authRes = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test-device@example.com',
      password: 'Test123!@#',
    });
    accessToken = authRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('//devices (POST)', () => {
    it('should create a new device', () => {
      return request(app.getHttpServer())
        .post('//devices')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          pushToken: 'test-pushToken',
          platform: 'ios',
          lastActiveAt: new Date().toISOString(),
          deviceInfo: { test: 'data' },
          isActive: true,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('pushToken');
          expect(res.body).toHaveProperty('platform');
          expect(res.body).toHaveProperty('lastActiveAt');
          expect(res.body).toHaveProperty('deviceInfo');
          expect(res.body).toHaveProperty('isActive');
          createdDeviceId = res.body.id;
        });
    });

    it('should reject invalid data', () => {
      return request(app.getHttpServer())
        .post('//devices')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          // Missing required fields
        })
        .expect(400);
    });

    it('should reject unauthenticated request', () => {
      return request(app.getHttpServer())
        .post('//devices')
        .send({
          pushToken: 'test-pushToken',
          platform: 'ios',
        })
        .expect(401);
    });
  });

  describe('//devices (GET)', () => {
    it('should get all devices', () => {
      return request(app.getHttpServer())
        .get('//devices')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('//devices?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('//devices/:id (GET)', () => {
    it('should get a single device by id', () => {
      return request(app.getHttpServer())
        .get(`//devices/${createdDeviceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdDeviceId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('//devices/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('//devices/:id (PATCH)', () => {
    it('should update a device', () => {
      return request(app.getHttpServer())
        .patch(`//devices/${createdDeviceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          pushToken: 'updated-pushToken',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdDeviceId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .patch('//devices/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });
  });

  describe('//devices/:id (DELETE)', () => {
    it('should delete a device', () => {
      return request(app.getHttpServer())
        .delete(`//devices/${createdDeviceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent id', () => {
      return request(app.getHttpServer())
        .delete('//devices/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
