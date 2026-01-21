import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskOutputDto } from './dto/task-output.dto';
import { PaginatedResponse, createPaginatedResponse } from '../../pagination.dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(dto: CreateTaskDto, userId: string): Promise<TaskOutputDto> {
    const taskData = { ...dto, userId };
    const created = await this.taskRepository.create(taskData);
    return this.mapToOutput(created);
  }

  async findAll(
    userId: string,
    page?: number,
    limit?: number,
    filters?: {
      search?: string;
      priority?: string;
      status?: string;
      sortBy?: string;
      order?: string;
      dateFilter?: string;
    },
  ): Promise<PaginatedResponse<TaskOutputDto>> {
    // Pagination defaults: page 1, limit 10, max 100
    const currentPage = Math.max(1, Number(page) || 1);
    const itemsPerPage = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (currentPage - 1) * itemsPerPage;

    // Build filter query - Scope by userId
    const query: any = { userId, isDeleted: { $ne: true } };

    // Search in title and description using text index (much faster than regex)
    if (filters?.search && filters.search.trim().length > 0) {
      const searchTerm = filters.search.trim();
      // Use text index for longer searches (3+ chars), regex for short queries
      if (searchTerm.length >= 3) {
        // Use MongoDB text search with the text index
        query.$text = { $search: searchTerm };
      } else {
        // Fallback to regex for very short queries (text search requires 3+ chars)
        query.$or = [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
        ];
      }
    }

    // Filter by priority (support multiple: "High,Medium")
    if (filters?.priority) {
      const priorities = filters.priority.split(',').map((p) => p.trim());
      query.priority = { $in: priorities };
    }

    // Filter by status
    if (filters?.status) {
      query.status = filters.status;
    }

    // Date filter
    if (filters?.dateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);

      switch (filters.dateFilter) {
        case 'today':
          query.dueDate = { $gte: today, $lt: tomorrow };
          break;
        case 'week':
          query.dueDate = { $gte: today, $lt: weekEnd };
          break;
        case 'overdue':
          query.dueDate = { $lt: today };
          query.status = { $ne: 'Completed' };
          break;
        case 'nodate':
          query.dueDate = null;
          break;
      }
    }

    // Sorting
    let sort: any = {};
    const sortField = filters?.sortBy || 'createdAt';
    const sortOrder = filters?.order === 'asc' ? 1 : -1;

    if (sortField === 'priority') {
      // Priority sort: Urgent > High > Medium > Low (desc) or Low > Medium > High > Urgent (asc)
      sort = { priority: sortOrder };
    } else if (sortField === 'dueDate') {
      // Due date sort (nulls last)
      sort = { dueDate: sortOrder };
    } else {
      // Default: createdAt (newest first)
      sort = { createdAt: sortOrder };
    }

    const [items, total] = await Promise.all([
      this.taskRepository.findWithFilters(query, sort, skip, itemsPerPage),
      this.taskRepository.countWithFilters(query),
    ]);

    const data = items.map((item) => this.mapToOutput(item));
    return createPaginatedResponse(data, total, currentPage, itemsPerPage);
  }

  async findOne(id: string, userId: string): Promise<TaskOutputDto> {
    const item = await this.taskRepository.findById(id);
    if (!item || item.userId !== userId) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.mapToOutput(item);
  }

  async update(id: string, dto: UpdateTaskDto, userId: string): Promise<TaskOutputDto> {
    // Check ownership first
    const existing = await this.taskRepository.findById(id);
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const updated = await this.taskRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.mapToOutput(updated);
  }

  async remove(id: string, userId: string): Promise<void> {
    // Check ownership first
    const existing = await this.taskRepository.findById(id);
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

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
