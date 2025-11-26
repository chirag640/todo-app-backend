import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskOutputDto } from './dto/task-output.dto';
import { PaginatedResponse, createPaginatedResponse } from '../../pagination.dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(dto: CreateTaskDto): Promise<TaskOutputDto> {
    const created = await this.taskRepository.create(dto);
    return this.mapToOutput(created);
  }

  async findAll(page?: number, limit?: number): Promise<PaginatedResponse<TaskOutputDto>> {
    // Pagination defaults: page 1, limit 10, max 100
    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (currentPage - 1) * itemsPerPage;

    const [items, total] = await Promise.all([
      this.taskRepository.findAll(skip, itemsPerPage),
      this.taskRepository.count(),
    ]);

    const data = items.map((item) => this.mapToOutput(item));
    return createPaginatedResponse(data, total, currentPage, itemsPerPage);
  }

  async findOne(id: string): Promise<TaskOutputDto> {
    const item = await this.taskRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.mapToOutput(item);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskOutputDto> {
    const updated = await this.taskRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.mapToOutput(updated);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.taskRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  private mapToOutput(item: any): TaskOutputDto {
    return {
      id: item._id?.toString() || item.id,
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      dueDate: item.dueDate,
      startDate: item.startDate,
      completedAt: item.completedAt,
      createdByDeviceId: item.createdByDeviceId,
      recurrenceRule: item.recurrenceRule,
      reminders: item.reminders,
      reminderPolicy: item.reminderPolicy,
      tags: item.tags,
      attachments: item.attachments,
      estimatedMinutes: item.estimatedMinutes,
      position: item.position,
      isArchived: item.isArchived,
      isDeleted: item.isDeleted,
      syncVersion: item.syncVersion,
      lastModifiedDeviceId: item.lastModifiedDeviceId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
