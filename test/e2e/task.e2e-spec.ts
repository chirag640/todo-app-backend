import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('Task CRUD (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Register and login to get access token
    const authRes = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test-task@example.com',
      password: 'Test123!@#',
    });
    accessToken = authRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('//tasks (POST)', () => {
    it('should create a new task', () => {
      return request(app.getHttpServer())
        .post('//tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'test-title',
          description: 'test-description',
          status: 'Pending',
          priority: 'Low',
          dueDate: new Date().toISOString(),
          startDate: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          createdByDeviceId: 'test-createdByDeviceId',
          recurrenceRule: 'test-recurrenceRule',
          reminders: { test: 'data' },
          reminderPolicy: { test: 'data' },
          tags: ['test-item'],
          attachments: [{ test: 'data' }],
          estimatedMinutes: 123,
          position: 123,
          isArchived: true,
          isDeleted: true,
          syncVersion: 123,
          lastModifiedDeviceId: 'test-lastModifiedDeviceId',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('description');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('priority');
          expect(res.body).toHaveProperty('dueDate');
          expect(res.body).toHaveProperty('startDate');
          expect(res.body).toHaveProperty('completedAt');
          expect(res.body).toHaveProperty('createdByDeviceId');
          expect(res.body).toHaveProperty('recurrenceRule');
          expect(res.body).toHaveProperty('reminders');
          expect(res.body).toHaveProperty('reminderPolicy');
          expect(res.body).toHaveProperty('tags');
          expect(res.body).toHaveProperty('attachments');
          expect(res.body).toHaveProperty('estimatedMinutes');
          expect(res.body).toHaveProperty('position');
          expect(res.body).toHaveProperty('isArchived');
          expect(res.body).toHaveProperty('isDeleted');
          expect(res.body).toHaveProperty('syncVersion');
          expect(res.body).toHaveProperty('lastModifiedDeviceId');
          createdTaskId = res.body.id;
        });
    });

    it('should reject invalid data', () => {
      return request(app.getHttpServer())
        .post('//tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          // Missing required fields
        })
        .expect(400);
    });

    it('should reject unauthenticated request', () => {
      return request(app.getHttpServer())
        .post('//tasks')
        .send({
          title: 'test-title',
          status: 'Pending',
          priority: 'Low',
        })
        .expect(401);
    });
  });

  describe('//tasks (GET)', () => {
    it('should get all tasks', () => {
      return request(app.getHttpServer())
        .get('//tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('//tasks?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('//tasks/:id (GET)', () => {
    it('should get a single task by id', () => {
      return request(app.getHttpServer())
        .get(`//tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdTaskId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('//tasks/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('//tasks/:id (PATCH)', () => {
    it('should update a task', () => {
      return request(app.getHttpServer())
        .patch(`//tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'updated-title',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdTaskId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .patch('//tasks/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });
  });

  describe('//tasks/:id (DELETE)', () => {
    it('should delete a task', () => {
      return request(app.getHttpServer())
        .delete(`//tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent id', () => {
      return request(app.getHttpServer())
        .delete('//tasks/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
