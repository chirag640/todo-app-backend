import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('List CRUD (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdListId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Register and login to get access token
    const authRes = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test-list@example.com',
      password: 'Test123!@#',
    });
    accessToken = authRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('//lists (POST)', () => {
    it('should create a new list', () => {
      return request(app.getHttpServer())
        .post('//lists')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'test-title',
          description: 'test-description',
          isShared: true,
          position: 123,
          colorHex: 'test-colorHex',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('description');
          expect(res.body).toHaveProperty('isShared');
          expect(res.body).toHaveProperty('position');
          expect(res.body).toHaveProperty('colorHex');
          createdListId = res.body.id;
        });
    });

    it('should reject invalid data', () => {
      return request(app.getHttpServer())
        .post('//lists')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          // Missing required fields
        })
        .expect(400);
    });

    it('should reject unauthenticated request', () => {
      return request(app.getHttpServer())
        .post('//lists')
        .send({
          title: 'test-title',
        })
        .expect(401);
    });
  });

  describe('//lists (GET)', () => {
    it('should get all lists', () => {
      return request(app.getHttpServer())
        .get('//lists')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('//lists?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('//lists/:id (GET)', () => {
    it('should get a single list by id', () => {
      return request(app.getHttpServer())
        .get(`//lists/${createdListId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdListId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('//lists/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('//lists/:id (PATCH)', () => {
    it('should update a list', () => {
      return request(app.getHttpServer())
        .patch(`//lists/${createdListId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'updated-title',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdListId);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .patch('//lists/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(404);
    });
  });

  describe('//lists/:id (DELETE)', () => {
    it('should delete a list', () => {
      return request(app.getHttpServer())
        .delete(`//lists/${createdListId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent id', () => {
      return request(app.getHttpServer())
        .delete('//lists/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
