import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let repository: jest.Mocked<TaskRepository>;


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
    it('should create a task', async () => {
      const createDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'Medium',
        dueDate: new Date(),
      };

      const expectedOutput = {
        id: '507f1f77bcf86cd799439011',
        title: 'Test Task',
        description: 'Test Description',
        status: 'Pending',
        priority: 'Medium',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'create').mockResolvedValue(expectedOutput as any);

      const result = await service.create(createDto, 'test-user-id');
      expect(result).toEqual(expectedOutput);
      expect(repository.create).toHaveBeenCalledWith({ ...createDto, userId: 'test-user-id' });
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const expectedOutput = [
        {
          id: '507f1f77bcf86cd799439011',
          title: 'Test Task',
          description: 'Test Description',
          status: 'Pending',
          priority: 'Medium',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(repository, 'findWithFilters').mockResolvedValue(expectedOutput as any);
      jest.spyOn(repository, 'countWithFilters').mockResolvedValue(1);

      const result = await service.findAll('test-user-id', 1, 10);
      expect(result.data).toEqual(expectedOutput);
      expect(repository.findWithFilters).toHaveBeenCalled();
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
        userId: 'test-user-id',
      };

      jest.spyOn(repository, 'findById').mockResolvedValue(expectedOutput as any);

      const result = await service.findOne('507f1f77bcf86cd799439011', 'test-user-id');
      expect(result).toEqual(expectedOutput);
      expect(repository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(service.findOne('507f1f77bcf86cd799439011', 'test-user-id')).rejects.toThrow(NotFoundException);
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
        userId: 'test-user-id',
      };

      jest.spyOn(repository, 'findById').mockResolvedValue({ userId: 'test-user-id' } as any);
      jest.spyOn(repository, 'update').mockResolvedValue(expectedOutput as any);

      const result = await service.update('507f1f77bcf86cd799439011', updateDto, 'test-user-id');
      expect(result).toEqual(expectedOutput);
      expect(repository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateDto);
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(service.update('507f1f77bcf86cd799439011', {}, 'test-user-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue({ userId: 'test-user-id' } as any);
      jest.spyOn(repository, 'delete').mockResolvedValue({} as any);

      await service.remove('507f1f77bcf86cd799439011', 'test-user-id');
      expect(repository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(service.remove('507f1f77bcf86cd799439011', 'test-user-id')).rejects.toThrow(NotFoundException);
    });
  });
  });})
