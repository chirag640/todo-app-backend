import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('Tag CRUD (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdTagId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Register and login to get access token
    const authRes = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test-tag@example.com',
      password: 'Test123!@#',
    });
    accessToken = authRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('//tags (POST)', () => {
    it('should create a new tag', () => {
      return request(app.getHttpServer())
        .post('//tags')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'test-name',
          colorHex: 'test-colorHex',
          isSystem: true,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('colorHex');
          expect(res.body).toHaveProperty('isSystem');
          createdTagId = res.body.id;
        });
    });

    it('should reject invalid data', () => {
      return request(app.getHttpServer())
        .post('//tags')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          // Missing required fields
        })
        .expect(400);
    });

    it('should reject unauthenticated request', () => {
      return request(app.getHttpServer())
        .post('//tags')
        .send({
          name: 'test-name',
        })
        .expect(401);
    });
  });

  describe('//tags (GET)', () => {
    it('should get all tags', () => {
      return request(app.getHttpServer())
        .get('//tags')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('//tags?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('//tags/:id (GET)', () => {
    it('should get a single tag by id', () => {
      return request(app.getHttpServer())
        .get(`//tags/${createdTagId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdTagId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('//tags/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('//tags/:id (PATCH)', () => {
    it('should update a tag', () => {
      return request(app.getHttpServer())
        .patch(`//tags/${createdTagId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'updated-name',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdTagId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .patch('//tags/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });
  });

  describe('//tags/:id (DELETE)', () => {
    it('should delete a tag', () => {
      return request(app.getHttpServer())
        .delete(`//tags/${createdTagId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent id', () => {
      return request(app.getHttpServer())
        .delete('//tags/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
