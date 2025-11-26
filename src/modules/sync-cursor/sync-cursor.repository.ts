import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { SyncCursor, SyncCursorDocument } from './schemas/sync-cursor.schema';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class SyncCursorRepository extends BaseRepository<SyncCursorDocument> {
  constructor(
    @InjectModel(SyncCursor.name)
    private readonly syncCursorModel: Model<SyncCursorDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(syncCursorModel, connection);
  }

  async create(data: Partial<SyncCursor>): Promise<SyncCursor> {
    const created = new this.syncCursorModel(data);
    const saved = await created.save();
    return saved.toObject() as SyncCursor;
  }

  async findAll(skip: number = 0, limit: number = 10): Promise<SyncCursor[]> {
    return this.syncCursorModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // Most recent first
      .lean()
      .exec() as Promise<SyncCursor[]>;
  }

  async findById(id: string): Promise<SyncCursor | null> {
    return this.syncCursorModel.findById(id).lean().exec() as Promise<SyncCursor | null>;
  }

  async update(id: string, data: Partial<SyncCursor>): Promise<SyncCursor | null> {
    return this.syncCursorModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec() as Promise<SyncCursor | null>;
  }

  async delete(id: string): Promise<SyncCursor | null> {
    return this.syncCursorModel.findByIdAndDelete(id).lean().exec() as Promise<SyncCursor | null>;
  }

  async count(): Promise<number> {
    return this.syncCursorModel.countDocuments().exec();
  }

  /**
   * Relationship Management Methods
   */
}
