import { Test, TestingModule } from '@nestjs/testing';
import { SubtaskService } from './subtask.service';
import { SubtaskRepository } from './subtask.repository';
import { NotFoundException } from '@nestjs/common';

describe('SubtaskService', () => {
  let service: SubtaskService;
  let repository: jest.Mocked<SubtaskRepository>;

  const mockSubtask = {
    _id: '507f1f77bcf86cd799439011',
    title: 'test-title',
    isCompleted: true,
    completedAt: new Date(),
    position: 123,
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
        SubtaskService,
        {
          provide: SubtaskRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SubtaskService>(SubtaskService);
    repository = module.get(SubtaskRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a subtask successfully', async () => {
      const createDto = {
        title: 'test-title',
        isCompleted: true,
        completedAt: new Date(),
        position: 123,
      };

      repository.create.mockResolvedValue(mockSubtask as any);

      const result = await service.create(createDto);

      expect(result).toEqual(mockSubtask);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated subtasks', async () => {
      const mockResult = {
        items: [mockSubtask],
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
    it('should return a subtask by id', async () => {
      repository.findById.mockResolvedValue(mockSubtask as any);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockSubtask);
      expect(repository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if subtask not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a subtask successfully', async () => {
      const updateDto = {};

      const updatedMock = { ...mockSubtask, ...updateDto };
      repository.findById.mockResolvedValue(mockSubtask as any);
      repository.update.mockResolvedValue(updatedMock as any);

      const result = await service.update('507f1f77bcf86cd799439011', updateDto);

      expect(result).toEqual(updatedMock);
      expect(repository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateDto);
    });

    it('should throw NotFoundException if subtask not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('507f1f77bcf86cd799439011', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a subtask successfully', async () => {
      repository.findById.mockResolvedValue(mockSubtask as any);
      // repository.remove.mockResolvedValue(undefined);

      await service.remove('507f1f77bcf86cd799439011');

      // expect(repository.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(repository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if subtask not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });
});
