import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class TaskRepository extends BaseRepository<TaskDocument> {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(taskModel, connection);
  }

  async create(data: Partial<Task>): Promise<Task> {
    const created = new this.taskModel(data);
    const saved = await created.save();
    return saved.toObject() as Task;
  }

  async findAll(skip: number = 0, limit: number = 10): Promise<Task[]> {
    return this.taskModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // Most recent first
      .lean()
      .exec() as Promise<Task[]>;
  }

  async findById(id: string): Promise<Task | null> {
    return this.taskModel.findById(id).lean().exec() as Promise<Task | null>;
  }

  async update(id: string, data: Partial<Task>): Promise<Task | null> {
    return this.taskModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec() as Promise<Task | null>;
  }

  async delete(id: string): Promise<Task | null> {
    return this.taskModel.findByIdAndDelete(id).lean().exec() as Promise<Task | null>;
  }

  async count(): Promise<number> {
    return this.taskModel.countDocuments().exec();
  }

  async findWithFilters(query: any, sort: any, skip: number, limit: number): Promise<Task[]> {
    return this.taskModel.find(query).sort(sort).skip(skip).limit(limit).lean().exec() as Promise<
      Task[]
    >;
  }

  async countWithFilters(query: any): Promise<number> {
    return this.taskModel.countDocuments(query).exec();
  }

  /**
   * Relationship Management Methods
   */
}
