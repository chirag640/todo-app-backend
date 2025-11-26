import { Injectable, NotFoundException } from '@nestjs/common';
import { SyncCursorRepository } from './sync-cursor.repository';
import { CreateSyncCursorDto } from './dto/create-sync-cursor.dto';
import { UpdateSyncCursorDto } from './dto/update-sync-cursor.dto';
import { SyncCursorOutputDto } from './dto/sync-cursor-output.dto';
import { PaginatedResponse, createPaginatedResponse } from '../../pagination.dto';

@Injectable()
export class SyncCursorService {
  constructor(private readonly syncCursorRepository: SyncCursorRepository) {}

  async create(dto: CreateSyncCursorDto): Promise<SyncCursorOutputDto> {
    const created = await this.syncCursorRepository.create(dto);
    return this.mapToOutput(created);
  }

  async findAll(page?: number, limit?: number): Promise<PaginatedResponse<SyncCursorOutputDto>> {
    // Pagination defaults: page 1, limit 10, max 100
    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, total] = await Promise.all([
      this.syncCursorRepository.findAll(skip, itemsPerPage),
      this.syncCursorRepository.count(),
    ]);

    const data = items.map((item) => this.mapToOutput(item));
    return createPaginatedResponse(data, total, currentPage, itemsPerPage);
  }

  async findOne(id: string): Promise<SyncCursorOutputDto> {
    const item = await this.syncCursorRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`SyncCursor with ID ${id} not found`);
    }
    return this.mapToOutput(item);
  }

  async update(id: string, dto: UpdateSyncCursorDto): Promise<SyncCursorOutputDto> {
    const updated = await this.syncCursorRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`SyncCursor with ID ${id} not found`);
    }
    return this.mapToOutput(updated);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.syncCursorRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`SyncCursor with ID ${id} not found`);
    }
  }

  private mapToOutput(item: any): SyncCursorOutputDto {
    return {
      id: item._id?.toString() || item.id,
      lastSyncAt: item.lastSyncAt,
      lastServerVersion: item.lastServerVersion,
      deviceId: item.deviceId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
