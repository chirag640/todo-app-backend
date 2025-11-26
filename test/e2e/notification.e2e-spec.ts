import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('Notification CRUD (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdNotificationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Register and login to get access token
    const authRes = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test-notification@example.com',
      password: 'Test123!@#',
    });
    accessToken = authRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('//notifications (POST)', () => {
    it('should create a new notification', () => {
      return request(app.getHttpServer())
        .post('//notifications')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'Reminder',
          title: 'test-title',
          body: 'test-body',
          sentAt: new Date().toISOString(),
          deliveredAt: new Date().toISOString(),
          status: 'Pending',
          payload: { test: 'data' },
          fcmMessageId: 'test-fcmMessageId',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('type');
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('body');
          expect(res.body).toHaveProperty('sentAt');
          expect(res.body).toHaveProperty('deliveredAt');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('payload');
          expect(res.body).toHaveProperty('fcmMessageId');
          createdNotificationId = res.body.id;
        });
    });

    it('should reject invalid data', () => {
      return request(app.getHttpServer())
        .post('//notifications')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          // Missing required fields
        })
        .expect(400);
    });

    it('should reject unauthenticated request', () => {
      return request(app.getHttpServer())
        .post('//notifications')
        .send({
          type: 'Reminder',
          title: 'test-title',
          status: 'Pending',
        })
        .expect(401);
    });
  });

  describe('//notifications (GET)', () => {
    it('should get all notifications', () => {
      return request(app.getHttpServer())
        .get('//notifications')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('//notifications?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('//notifications/:id (GET)', () => {
    it('should get a single notification by id', () => {
      return request(app.getHttpServer())
        .get(`//notifications/${createdNotificationId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdNotificationId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('//notifications/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('//notifications/:id (PATCH)', () => {
    it('should update a notification', () => {
      return request(app.getHttpServer())
        .patch(`//notifications/${createdNotificationId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'updated-title',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdNotificationId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .patch('//notifications/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });
  });

  describe('//notifications/:id (DELETE)', () => {
    it('should delete a notification', () => {
      return request(app.getHttpServer())
        .delete(`//notifications/${createdNotificationId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent id', () => {
      return request(app.getHttpServer())
        .delete('//notifications/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
