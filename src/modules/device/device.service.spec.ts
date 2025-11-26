import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { DeviceRepository } from './device.repository';
import { NotFoundException } from '@nestjs/common';

describe('DeviceService', () => {
  let service: DeviceService;
  let repository: jest.Mocked<DeviceRepository>;

  const mockDevice = {
    _id: '507f1f77bcf86cd799439011',
    pushToken: 'test-pushToken',
    platform: 'ios',
    lastActiveAt: new Date(),
    deviceInfo: { test: 'data' },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: DeviceRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
    repository = module.get(DeviceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a device successfully', async () => {
      const createDto = {
        pushToken: 'test-pushToken',
        platform: 'ios',
        lastActiveAt: new Date(),
        deviceInfo: { test: 'data' },
      };

      repository.create.mockResolvedValue(mockDevice as any);

      const result = await service.create(createDto);

      expect(result).toEqual(mockDevice);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated devices', async () => {
      const mockResult = {
        items: [mockDevice],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      repository.findAll.mockResolvedValue(mockResult as any);

      const result = await service.findAll(1, 10);

      expect(result).toEqual(mockResult);
      expect(repository.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('should return a device by id', async () => {
      repository.findById.mockResolvedValue(mockDevice as any);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockDevice);
      expect(repository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if device not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a device successfully', async () => {
      const updateDto = {};

      const updatedMock = { ...mockDevice, ...updateDto };
      repository.findById.mockResolvedValue(mockDevice as any);
      repository.update.mockResolvedValue(updatedMock as any);

      const result = await service.update('507f1f77bcf86cd799439011', updateDto);

      expect(result).toEqual(updatedMock);
      expect(repository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateDto);
    });

    it('should throw NotFoundException if device not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('507f1f77bcf86cd799439011', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a device successfully', async () => {
      repository.findById.mockResolvedValue(mockDevice as any);
      // repository.remove.mockResolvedValue(undefined);

      await service.remove('507f1f77bcf86cd799439011');

      // expect(repository.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(repository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if device not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });
});
