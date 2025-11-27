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

      const result = await controller.create(createDto as any, { user: { userId: 'test-user-id' } });
      expect(result).toEqual(mockTask);
      expect(service.create).toHaveBeenCalledWith(createDto, 'test-user-id');
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const expectedOutput = {
        data: [
          {
            id: '507f1f77bcf86cd799439011',
            title: 'Test Task',
            description: 'Test Description',
            status: 'Pending',
            priority: 'Medium',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          pages: 1,
        },
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedOutput as any);

      const result = await controller.findAll({ user: { userId: 'test-user-id' } });
      expect(result).toEqual(expectedOutput);
      expect(service.findAll).toHaveBeenCalledWith('test-user-id', undefined, undefined, {
        search: undefined,
        priority: undefined,
        status: undefined,
        sortBy: undefined,
        order: undefined,
        dateFilter: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const expectedOutput = {
        id: '507f1f77bcf86cd799439011',
        title: 'Test Task',
        description: 'Test Description',
        status: 'Pending',
        priority: 'Medium',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedOutput as any);

      const result = await controller.findOne('507f1f77bcf86cd799439011', { user: { userId: 'test-user-id' } });
      expect(result).toEqual(expectedOutput);
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'test-user-id');
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateDto = { title: 'Updated Task' };
      const expectedOutput = {
        id: '507f1f77bcf86cd799439011',
        title: 'Updated Task',
        description: 'Test Description',
        status: 'Pending',
        priority: 'Medium',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedOutput as any);

      const result = await controller.update('507f1f77bcf86cd799439011', updateDto as any, { user: { userId: 'test-user-id' } });
      expect(result).toEqual(expectedOutput);
      expect(service.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateDto, 'test-user-id');
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('507f1f77bcf86cd799439011', { user: { userId: 'test-user-id' } });
      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'test-user-id');
    });
  });
});
