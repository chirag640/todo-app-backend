import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';

describe('ListController', () => {
  let controller: ListController;
  let service: jest.Mocked<ListService>;

  const mockList = {
    _id: '507f1f77bcf86cd799439011',
    title: 'test-title',
    description: 'test-description',
    isShared: true,
    position: 123,
    colorHex: 'test-colorHex',
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
      controllers: [ListController],
      providers: [
        {
          provide: ListService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ListController>(ListController);
    service = module.get(ListService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a list', async () => {
      const createDto = {
        title: 'test-title',
        description: 'test-description',
        isShared: true,
        position: 123,
        colorHex: 'test-colorHex',
      };

      service.create.mockResolvedValue(mockList as any);

      const result = await controller.create(createDto as any);

      expect(result).toEqual(mockList);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated lists', async () => {
      const mockResult = {
        items: [mockList],
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
    it('should return a list by id', async () => {
      service.findOne.mockResolvedValue(mockList as any);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockList);
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('update', () => {
    it('should update a list', async () => {
      const updateDto = {};

      const updatedMock = { ...mockList, ...updateDto };
      service.update.mockResolvedValue(updatedMock as any);

      const result = await controller.update('507f1f77bcf86cd799439011', updateDto as any);

      expect(result).toEqual(updatedMock);
      expect(service.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a list', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('507f1f77bcf86cd799439011');

      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });
});
