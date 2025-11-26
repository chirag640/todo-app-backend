import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('User CRUD (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Register and login to get access token
    const authRes = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test-user@example.com',
      password: 'Test123!@#',
    });
    accessToken = authRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('//users (POST)', () => {
    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post('//users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          email: 'test-email',
          displayName: 'test-displayName',
          passwordHash: 'test-passwordHash',
          roles: ['test-item'],
          createdVia: 'email',
          preferences: { test: 'data' },
          timezone: 'test-timezone',
          isActive: true,
          lastSeenAt: new Date().toISOString(),
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('displayName');
          expect(res.body).toHaveProperty('passwordHash');
          expect(res.body).toHaveProperty('roles');
          expect(res.body).toHaveProperty('createdVia');
          expect(res.body).toHaveProperty('preferences');
          expect(res.body).toHaveProperty('timezone');
          expect(res.body).toHaveProperty('isActive');
          expect(res.body).toHaveProperty('lastSeenAt');
          createdUserId = res.body.id;
        });
    });

    it('should reject invalid data', () => {
      return request(app.getHttpServer())
        .post('//users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          // Missing required fields
        })
        .expect(400);
    });

    it('should reject unauthenticated request', () => {
      return request(app.getHttpServer())
        .post('//users')
        .send({
          email: 'test-email',
          roles: ['test-item'],
          createdVia: 'email',
        })
        .expect(401);
    });
  });

  describe('//users (GET)', () => {
    it('should get all users', () => {
      return request(app.getHttpServer())
        .get('//users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('//users?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('//users/:id (GET)', () => {
    it('should get a single user by id', () => {
      return request(app.getHttpServer())
        .get(`//users/${createdUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdUserId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('//users/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('//users/:id (PATCH)', () => {
    it('should update a user', () => {
      return request(app.getHttpServer())
        .patch(`//users/${createdUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          email: 'updated-email',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdUserId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .patch('//users/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });
  });

  describe('//users/:id (DELETE)', () => {
    it('should delete a user', () => {
      return request(app.getHttpServer())
        .delete(`//users/${createdUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent id', () => {
      return request(app.getHttpServer())
        .delete('//users/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
