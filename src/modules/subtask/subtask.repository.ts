import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Subtask, SubtaskDocument } from './schemas/subtask.schema';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class SubtaskRepository extends BaseRepository<SubtaskDocument> {
  constructor(
    @InjectModel(Subtask.name)
    private readonly subtaskModel: Model<SubtaskDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(subtaskModel, connection);
  }

  async create(data: Partial<Subtask>): Promise<Subtask> {
    const created = new this.subtaskModel(data);
    const saved = await created.save();
    return saved.toObject() as Subtask;
  }

  async findAll(skip: number = 0, limit: number = 10): Promise<Subtask[]> {
    return this.subtaskModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // Most recent first
      .lean()
      .exec() as Promise<Subtask[]>;
  }

  async findById(id: string): Promise<Subtask | null> {
    return this.subtaskModel.findById(id).lean().exec() as Promise<Subtask | null>;
  }

  async update(id: string, data: Partial<Subtask>): Promise<Subtask | null> {
    return this.subtaskModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec() as Promise<Subtask | null>;
  }

  async delete(id: string): Promise<Subtask | null> {
    return this.subtaskModel.findByIdAndDelete(id).lean().exec() as Promise<Subtask | null>;
  }

  async count(): Promise<number> {
    return this.subtaskModel.countDocuments().exec();
  }

  /**
   * Relationship Management Methods
   */
}
