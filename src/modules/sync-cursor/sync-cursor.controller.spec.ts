import { Test, TestingModule } from '@nestjs/testing';
import { SyncCursorController } from './sync-cursor.controller';
import { SyncCursorService } from './sync-cursor.service';

describe('SyncCursorController', () => {
  let controller: SyncCursorController;
  let service: jest.Mocked<SyncCursorService>;

  const mockSyncCursor = {
    _id: '507f1f77bcf86cd799439011',
    lastSyncAt: 'test-value',
    lastServerVersion: 123,
    deviceId: 'test-deviceId',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyncCursorController],
      providers: [
        {
          provide: SyncCursorService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SyncCursorController>(SyncCursorController);
    service = module.get(SyncCursorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a syncCursor', async () => {
      const createDto = {
        lastSyncAt: 'test-value',
        lastServerVersion: 123,
        deviceId: 'test-deviceId',
      };

      service.create.mockResolvedValue(mockSyncCursor as any);

      const result = await controller.create(createDto as any);

      expect(result).toEqual(mockSyncCursor);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated synccursors', async () => {
      const mockResult = {
        items: [mockSyncCursor],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      service.findAll.mockResolvedValue(mockResult as any);

      const result = await controller.findAll(1, 10);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('should return a syncCursor by id', async () => {
      service.findOne.mockResolvedValue(mockSyncCursor as any);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockSyncCursor);
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('update', () => {
    it('should update a syncCursor', async () => {
      const updateDto = {};

      const updatedMock = { ...mockSyncCursor, ...updateDto };
      service.update.mockResolvedValue(updatedMock as any);

      const result = await controller.update('507f1f77bcf86cd799439011', updateDto as any);

      expect(result).toEqual(updatedMock);
      expect(service.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a syncCursor', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('507f1f77bcf86cd799439011');

      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });
});
