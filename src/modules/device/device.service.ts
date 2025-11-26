import { Injectable, NotFoundException } from '@nestjs/common';
import { DeviceRepository } from './device.repository';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceOutputDto } from './dto/device-output.dto';
import { PaginatedResponse, createPaginatedResponse } from '../../pagination.dto';

@Injectable()
export class DeviceService {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async create(dto: CreateDeviceDto): Promise<DeviceOutputDto> {
    const created = await this.deviceRepository.create(dto);
    return this.mapToOutput(created);
  }

  async findAll(page?: number, limit?: number): Promise<PaginatedResponse<DeviceOutputDto>> {
    // Pagination defaults: page 1, limit 10, max 100
    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, total] = await Promise.all([
      this.deviceRepository.findAll(skip, itemsPerPage),
      this.deviceRepository.count(),
    ]);

    const data = items.map((item) => this.mapToOutput(item));
    return createPaginatedResponse(data, total, currentPage, itemsPerPage);
  }

  async findOne(id: string): Promise<DeviceOutputDto> {
    const item = await this.deviceRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
    return this.mapToOutput(item);
  }

  async update(id: string, dto: UpdateDeviceDto): Promise<DeviceOutputDto> {
    const updated = await this.deviceRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
    return this.mapToOutput(updated);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.deviceRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
  }

  private mapToOutput(item: any): DeviceOutputDto {
    return {
      id: item._id?.toString() || item.id,
      pushToken: item.pushToken,
      platform: item.platform,
      lastActiveAt: item.lastActiveAt,
      deviceInfo: item.deviceInfo,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
