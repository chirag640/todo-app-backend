import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { List, ListDocument } from './schemas/list.schema';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class ListRepository extends BaseRepository<ListDocument> {
  constructor(
    @InjectModel(List.name)
    private readonly listModel: Model<ListDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(listModel, connection);
  }

  async create(data: Partial<List>): Promise<List> {
    const created = new this.listModel(data);
    const saved = await created.save();
    return saved.toObject() as List;
  }

  async findAll(skip: number = 0, limit: number = 10): Promise<List[]> {
    return this.listModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // Most recent first
      .lean()
      .exec() as Promise<List[]>;
  }

  async findById(id: string): Promise<List | null> {
    return this.listModel.findById(id).lean().exec() as Promise<List | null>;
  }

  async update(id: string, data: Partial<List>): Promise<List | null> {
    return this.listModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec() as Promise<List | null>;
  }

  async delete(id: string): Promise<List | null> {
    return this.listModel.findByIdAndDelete(id).lean().exec() as Promise<List | null>;
  }

  async count(): Promise<number> {
    return this.listModel.countDocuments().exec();
  }

  /**
   * Relationship Management Methods
   */
}
