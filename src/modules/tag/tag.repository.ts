import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class TagRepository extends BaseRepository<TagDocument> {
  constructor(
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(tagModel, connection);
  }

  async create(data: Partial<Tag>): Promise<Tag> {
    const created = new this.tagModel(data);
    const saved = await created.save();
    return saved.toObject() as Tag;
  }

  async findAll(skip: number = 0, limit: number = 10): Promise<Tag[]> {
    return this.tagModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // Most recent first
      .lean()
      .exec() as Promise<Tag[]>;
  }

  async findById(id: string): Promise<Tag | null> {
    return this.tagModel.findById(id).lean().exec() as Promise<Tag | null>;
  }

  async update(id: string, data: Partial<Tag>): Promise<Tag | null> {
    return this.tagModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec() as Promise<Tag | null>;
  }

  async delete(id: string): Promise<Tag | null> {
    return this.tagModel.findByIdAndDelete(id).lean().exec() as Promise<Tag | null>;
  }

  async count(): Promise<number> {
    return this.tagModel.countDocuments().exec();
  }

  /**
   * Relationship Management Methods
   */
}
