import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { TagRepository } from './tag.repository';
import { NotFoundException } from '@nestjs/common';

describe('TagService', () => {
  let service: TagService;
  let repository: jest.Mocked<TagRepository>;

  const mockTag = {
    _id: '507f1f77bcf86cd799439011',
    name: 'test-name',
    colorHex: 'test-colorHex',
    isSystem: true,
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
        TagService,
        {
          provide: TagRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    repository = module.get(TagRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tag successfully', async () => {
      const createDto = {
        name: 'test-name',
        colorHex: 'test-colorHex',
        isSystem: true,
      };

      repository.create.mockResolvedValue(mockTag as any);

      const result = await service.create(createDto);

      expect(result).toEqual(mockTag);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated tags', async () => {
      const mockResult = {
        items: [mockTag],
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
    it('should return a tag by id', async () => {
      repository.findById.mockResolvedValue(mockTag as any);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockTag);
      expect(repository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if tag not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tag successfully', async () => {
      const updateDto = {};

      const updatedMock = { ...mockTag, ...updateDto };
      repository.findById.mockResolvedValue(mockTag as any);
      repository.update.mockResolvedValue(updatedMock as any);

      const result = await service.update('507f1f77bcf86cd799439011', updateDto);

      expect(result).toEqual(updatedMock);
      expect(repository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateDto);
    });

    it('should throw NotFoundException if tag not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('507f1f77bcf86cd799439011', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a tag successfully', async () => {
      repository.findById.mockResolvedValue(mockTag as any);
      // repository.remove.mockResolvedValue(undefined);

      await service.remove('507f1f77bcf86cd799439011');

      // expect(repository.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(repository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if tag not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });
});
