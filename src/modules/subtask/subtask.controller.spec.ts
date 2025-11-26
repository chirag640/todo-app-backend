import { Test, TestingModule } from '@nestjs/testing';
import { SubtaskController } from './subtask.controller';
import { SubtaskService } from './subtask.service';

describe('SubtaskController', () => {
  let controller: SubtaskController;
  let service: jest.Mocked<SubtaskService>;

  const mockSubtask = {
    _id: '507f1f77bcf86cd799439011',
    title: 'test-title',
    isCompleted: true,
    completedAt: 'test-value',
    position: 123,
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
      controllers: [SubtaskController],
      providers: [
        {
          provide: SubtaskService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SubtaskController>(SubtaskController);
    service = module.get(SubtaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a subtask', async () => {
      const createDto = {
        title: 'test-title',
        isCompleted: true,
        completedAt: 'test-value',
        position: 123,
      };

      service.create.mockResolvedValue(mockSubtask as any);

      const result = await controller.create(createDto as any);

      expect(result).toEqual(mockSubtask);
      expect(service.create).toHaveBeenCalledWith(createDto);
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

      service.findAll.mockResolvedValue(mockResult as any);

      const result = await controller.findAll(1, 10);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('should return a subtask by id', async () => {
      service.findOne.mockResolvedValue(mockSubtask as any);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockSubtask);
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('update', () => {
    it('should update a subtask', async () => {
      const updateDto = {};

      const updatedMock = { ...mockSubtask, ...updateDto };
      service.update.mockResolvedValue(updatedMock as any);

      const result = await controller.update('507f1f77bcf86cd799439011', updateDto as any);

      expect(result).toEqual(updatedMock);
      expect(service.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a subtask', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('507f1f77bcf86cd799439011');

      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });
});
