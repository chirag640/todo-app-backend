import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserOutputDto } from './dto/user-output.dto';
import { PaginatedResponse, createPaginatedResponse } from '../../pagination.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<UserOutputDto> {
    const created = await this.userRepository.create(dto);
    return this.mapToOutput(created);
  }

  async findAll(page?: number, limit?: number): Promise<PaginatedResponse<UserOutputDto>> {
    // Pagination defaults: page 1, limit 10, max 100
    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, total] = await Promise.all([
      this.userRepository.findAll(skip, itemsPerPage),
      this.userRepository.count(),
    ]);

    const data = items.map((item) => this.mapToOutput(item));
    return createPaginatedResponse(data, total, currentPage, itemsPerPage);
  }

  async findOne(id: string): Promise<UserOutputDto> {
    const item = await this.userRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToOutput(item);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserOutputDto> {
    const updated = await this.userRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToOutput(updated);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  private mapToOutput(item: any): UserOutputDto {
    return {
      id: item._id?.toString() || item.id,
      email: item.email,
      displayName: item.displayName,
      passwordHash: item.passwordHash,
      roles: item.roles,
      createdVia: item.createdVia,
      preferences: item.preferences,
      timezone: item.timezone,
      isActive: item.isActive,
      lastSeenAt: item.lastSeenAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
