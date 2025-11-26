import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('Subtask CRUD (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdSubtaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Register and login to get access token
    const authRes = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test-subtask@example.com',
      password: 'Test123!@#',
    });
    accessToken = authRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('//subtasks (POST)', () => {
    it('should create a new subtask', () => {
      return request(app.getHttpServer())
        .post('//subtasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'test-title',
          isCompleted: true,
          completedAt: new Date().toISOString(),
          position: 123,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('isCompleted');
          expect(res.body).toHaveProperty('completedAt');
          expect(res.body).toHaveProperty('position');
          createdSubtaskId = res.body.id;
        });
    });

    it('should reject invalid data', () => {
      return request(app.getHttpServer())
        .post('//subtasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          // Missing required fields
        })
        .expect(400);
    });

    it('should reject unauthenticated request', () => {
      return request(app.getHttpServer())
        .post('//subtasks')
        .send({
          title: 'test-title',
        })
        .expect(401);
    });
  });

  describe('//subtasks (GET)', () => {
    it('should get all subtasks', () => {
      return request(app.getHttpServer())
        .get('//subtasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('//subtasks?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('//subtasks/:id (GET)', () => {
    it('should get a single subtask by id', () => {
      return request(app.getHttpServer())
        .get(`//subtasks/${createdSubtaskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdSubtaskId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('//subtasks/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('//subtasks/:id (PATCH)', () => {
    it('should update a subtask', () => {
      return request(app.getHttpServer())
        .patch(`//subtasks/${createdSubtaskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'updated-title',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdSubtaskId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .patch('//subtasks/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });
  });

  describe('//subtasks/:id (DELETE)', () => {
    it('should delete a subtask', () => {
      return request(app.getHttpServer())
        .delete(`//subtasks/${createdSubtaskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent id', () => {
      return request(app.getHttpServer())
        .delete('//subtasks/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
