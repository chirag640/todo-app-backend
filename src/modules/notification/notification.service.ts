import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationOutputDto } from './dto/notification-output.dto';
import { PaginatedResponse, createPaginatedResponse } from '../../pagination.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async create(dto: CreateNotificationDto): Promise<NotificationOutputDto> {
    const created = await this.notificationRepository.create(dto);
    return this.mapToOutput(created);
  }

  async findAll(page?: number, limit?: number): Promise<PaginatedResponse<NotificationOutputDto>> {
    // Pagination defaults: page 1, limit 10, max 100
    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, total] = await Promise.all([
      this.notificationRepository.findAll(skip, itemsPerPage),
      this.notificationRepository.count(),
    ]);

    const data = items.map((item) => this.mapToOutput(item));
    return createPaginatedResponse(data, total, currentPage, itemsPerPage);
  }

  async findOne(id: string): Promise<NotificationOutputDto> {
    const item = await this.notificationRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return this.mapToOutput(item);
  }

  async update(id: string, dto: UpdateNotificationDto): Promise<NotificationOutputDto> {
    const updated = await this.notificationRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return this.mapToOutput(updated);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.notificationRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }

  private mapToOutput(item: any): NotificationOutputDto {
    return {
      id: item._id?.toString() || item.id,
      type: item.type,
      title: item.title,
      body: item.body,
      sentAt: item.sentAt,
      deliveredAt: item.deliveredAt,
      status: item.status,
      payload: item.payload,
      fcmMessageId: item.fcmMessageId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
