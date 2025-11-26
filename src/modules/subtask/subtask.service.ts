import { Injectable, NotFoundException } from '@nestjs/common';
import { SubtaskRepository } from './subtask.repository';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { SubtaskOutputDto } from './dto/subtask-output.dto';
import { PaginatedResponse, createPaginatedResponse } from '../../pagination.dto';

@Injectable()
export class SubtaskService {
  constructor(private readonly subtaskRepository: SubtaskRepository) {}

  async create(dto: CreateSubtaskDto): Promise<SubtaskOutputDto> {
    const created = await this.subtaskRepository.create(dto);
    return this.mapToOutput(created);
  }

  async findAll(page?: number, limit?: number): Promise<PaginatedResponse<SubtaskOutputDto>> {
    // Pagination defaults: page 1, limit 10, max 100
    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, total] = await Promise.all([
      this.subtaskRepository.findAll(skip, itemsPerPage),
      this.subtaskRepository.count(),
    ]);

    const data = items.map((item) => this.mapToOutput(item));
    return createPaginatedResponse(data, total, currentPage, itemsPerPage);
  }

  async findOne(id: string): Promise<SubtaskOutputDto> {
    const item = await this.subtaskRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }
    return this.mapToOutput(item);
  }

  async update(id: string, dto: UpdateSubtaskDto): Promise<SubtaskOutputDto> {
    const updated = await this.subtaskRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }
    return this.mapToOutput(updated);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.subtaskRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }
  }

  private mapToOutput(item: any): SubtaskOutputDto {
    return {
      id: item._id?.toString() || item.id,
      title: item.title,
      isCompleted: item.isCompleted,
      completedAt: item.completedAt,
      position: item.position,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
