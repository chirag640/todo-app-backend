import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let controller: TaskController;
  let service: jest.Mocked<TaskService>;

  const mockTask = {
    _id: '507f1f77bcf86cd799439011',
    title: 'test-title',
    description: 'test-description',
    status: 'test-value',
    priority: 'test-value',
    dueDate: 'test-value',
    startDate: 'test-value',
    completedAt: 'test-value',
    createdByDeviceId: 'test-createdByDeviceId',
    recurrenceRule: 'test-recurrenceRule',
    reminders: 'test-value',
    reminderPolicy: 'test-value',
    tags: 'test-value',
    attachments: 'test-value',
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
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createDto = {
        title: 'test-title',
        description: 'test-description',
        dueDate: 'test-value',
        startDate: 'test-value',
        completedAt: 'test-value',
        createdByDeviceId: 'test-createdByDeviceId',
        recurrenceRule: 'test-recurrenceRule',
        reminders: 'test-value',
        reminderPolicy: 'test-value',
        tags: 'test-value',
        attachments: 'test-value',
        estimatedMinutes: 123,
        position: 123,
        isArchived: true,
        isDeleted: true,
        lastModifiedDeviceId: 'test-lastModifiedDeviceId',
      };

      service.create.mockResolvedValue(mockTask as any);

      const result = await controller.create(createDto as any);

      expect(result).toEqual(mockTask);
      expect(service.create).toHaveBeenCalledWith(createDto);
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

      service.findAll.mockResolvedValue(mockResult as any);

      const result = await controller.findAll(1, 10);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      service.findOne.mockResolvedValue(mockTask as any);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockTask);
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateDto = {};

      const updatedMock = { ...mockTask, ...updateDto };
      service.update.mockResolvedValue(updatedMock as any);

      const result = await controller.update('507f1f77bcf86cd799439011', updateDto as any);

      expect(result).toEqual(updatedMock);
      expect(service.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('507f1f77bcf86cd799439011');

      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });
});
