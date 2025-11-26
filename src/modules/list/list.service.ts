import { Injectable, NotFoundException } from '@nestjs/common';
import { ListRepository } from './list.repository';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListOutputDto } from './dto/list-output.dto';
import { PaginatedResponse, createPaginatedResponse } from '../../pagination.dto';

@Injectable()
export class ListService {
  constructor(private readonly listRepository: ListRepository) {}

  async create(dto: CreateListDto): Promise<ListOutputDto> {
    const created = await this.listRepository.create(dto);
    return this.mapToOutput(created);
  }

  async findAll(page?: number, limit?: number): Promise<PaginatedResponse<ListOutputDto>> {
    // Pagination defaults: page 1, limit 10, max 100
    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, total] = await Promise.all([
      this.listRepository.findAll(skip, itemsPerPage),
      this.listRepository.count(),
    ]);

    const data = items.map((item) => this.mapToOutput(item));
    return createPaginatedResponse(data, total, currentPage, itemsPerPage);
  }

  async findOne(id: string): Promise<ListOutputDto> {
    const item = await this.listRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }
    return this.mapToOutput(item);
  }

  async update(id: string, dto: UpdateListDto): Promise<ListOutputDto> {
    const updated = await this.listRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }
    return this.mapToOutput(updated);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.listRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }
  }

  private mapToOutput(item: any): ListOutputDto {
    return {
      id: item._id?.toString() || item.id,
      title: item.title,
      description: item.description,
      isShared: item.isShared,
      position: item.position,
      colorHex: item.colorHex,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
