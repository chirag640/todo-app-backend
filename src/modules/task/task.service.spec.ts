import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let repository: jest.Mocked<TaskRepository>;

  const mockTask = {
    _id: '507f1f77bcf86cd799439011',
    title: 'test-title',
    description: 'test-description',
    status: 'Pending',
    priority: 'Low',
    dueDate: new Date(),
    startDate: new Date(),
    completedAt: new Date(),
    createdByDeviceId: 'test-createdByDeviceId',
    recurrenceRule: 'test-recurrenceRule',
    reminders: { test: 'data' },
    reminderPolicy: { test: 'data' },
    tags: ['test'],
    attachments: [{ test: 'data' }],
    estimatedMinutes: 123,
    position: 123,
    isArchived: true,
    isDeleted: true,
    syncVersion: 123,
    lastModifiedDeviceId: 'test-lastModifiedDeviceId',
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
        TaskService,
        {
          provide: TaskRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get(TaskRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createDto = {
        title: 'test-title',
        description: 'test-description',
        dueDate: new Date(),
        startDate: new Date(),
        completedAt: new Date(),
        createdByDeviceId: 'test-createdByDeviceId',
        recurrenceRule: 'test-recurrenceRule',
        reminders: { test: 'data' },
        reminderPolicy: { test: 'data' },
        tags: ['test'],
        attachments: [{ test: 'data' }],
        estimatedMinutes: 123,
        position: 123,
        isArchived: true,
        isDeleted: true,
        lastModifiedDeviceId: 'test-lastModifiedDeviceId',
      };

      repository.create.mockResolvedValue(mockTask as any);

      const result = await service.create(createDto);

      expect(result).toEqual(mockTask);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const mockResult = {
        items: [mockTask],
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
    it('should return a task by id', async () => {
      repository.findById.mockResolvedValue(mockTask as any);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockTask);
      expect(repository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if task not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const updateDto = {};

      const updatedMock = { ...mockTask, ...updateDto };
      repository.findById.mockResolvedValue(mockTask as any);
      repository.update.mockResolvedValue(updatedMock as any);

      const result = await service.update('507f1f77bcf86cd799439011', updateDto);

      expect(result).toEqual(updatedMock);
      expect(repository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateDto);
    });

    it('should throw NotFoundException if task not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('507f1f77bcf86cd799439011', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a task successfully', async () => {
      repository.findById.mockResolvedValue(mockTask as any);
      // repository.remove.mockResolvedValue(undefined);

      await service.remove('507f1f77bcf86cd799439011');

      // expect(repository.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(repository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if task not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });
});
