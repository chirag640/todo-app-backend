import { Injectable, NotFoundException } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagOutputDto } from './dto/tag-output.dto';
import { PaginatedResponse, createPaginatedResponse } from '../../pagination.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async create(dto: CreateTagDto): Promise<TagOutputDto> {
    const created = await this.tagRepository.create(dto);
    return this.mapToOutput(created);
  }

  async findAll(page?: number, limit?: number): Promise<PaginatedResponse<TagOutputDto>> {
    // Pagination defaults: page 1, limit 10, max 100
    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, total] = await Promise.all([
      this.tagRepository.findAll(skip, itemsPerPage),
      this.tagRepository.count(),
    ]);

    const data = items.map((item) => this.mapToOutput(item));
    return createPaginatedResponse(data, total, currentPage, itemsPerPage);
  }

  async findOne(id: string): Promise<TagOutputDto> {
    const item = await this.tagRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return this.mapToOutput(item);
  }

  async update(id: string, dto: UpdateTagDto): Promise<TagOutputDto> {
    const updated = await this.tagRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return this.mapToOutput(updated);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.tagRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
  }

  private mapToOutput(item: any): TagOutputDto {
    return {
      id: item._id?.toString() || item.id,
      name: item.name,
      colorHex: item.colorHex,
      isSystem: item.isSystem,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
