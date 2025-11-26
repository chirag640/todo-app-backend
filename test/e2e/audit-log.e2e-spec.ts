import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('AuditLog CRUD (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdAuditLogId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Register and login to get access token
    const authRes = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test-auditLog@example.com',
      password: 'Test123!@#',
    });
    accessToken = authRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('//auditlogs (POST)', () => {
    it('should create a new auditLog', () => {
      return request(app.getHttpServer())
        .post('//auditlogs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          entityType: 'test-entityType',
          entityId: 'test-entityId',
          action: 'test-action',
          delta: { test: 'data' },
          ip: 'test-ip',
          userAgent: 'test-userAgent',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('entityType');
          expect(res.body).toHaveProperty('entityId');
          expect(res.body).toHaveProperty('action');
          expect(res.body).toHaveProperty('delta');
          expect(res.body).toHaveProperty('ip');
          expect(res.body).toHaveProperty('userAgent');
          createdAuditLogId = res.body.id;
        });
    });

    it('should reject invalid data', () => {
      return request(app.getHttpServer())
        .post('//auditlogs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          // Missing required fields
        })
        .expect(400);
    });

    it('should reject unauthenticated request', () => {
      return request(app.getHttpServer())
        .post('//auditlogs')
        .send({
          entityType: 'test-entityType',
          entityId: 'test-entityId',
          action: 'test-action',
        })
        .expect(401);
    });
  });

  describe('//auditlogs (GET)', () => {
    it('should get all auditlogs', () => {
      return request(app.getHttpServer())
        .get('//auditlogs')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('//auditlogs?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('//auditlogs/:id (GET)', () => {
    it('should get a single auditLog by id', () => {
      return request(app.getHttpServer())
        .get(`//auditlogs/${createdAuditLogId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdAuditLogId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('//auditlogs/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('//auditlogs/:id (PATCH)', () => {
    it('should update a auditLog', () => {
      return request(app.getHttpServer())
        .patch(`//auditlogs/${createdAuditLogId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          entityType: 'updated-entityType',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdAuditLogId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .patch('//auditlogs/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });
  });

  describe('//auditlogs/:id (DELETE)', () => {
    it('should delete a auditLog', () => {
      return request(app.getHttpServer())
        .delete(`//auditlogs/${createdAuditLogId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent id', () => {
      return request(app.getHttpServer())
        .delete('//auditlogs/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
