import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class NotificationRepository extends BaseRepository<NotificationDocument> {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(notificationModel, connection);
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    const created = new this.notificationModel(data);
    const saved = await created.save();
    return saved.toObject() as Notification;
  }

  async findAll(skip: number = 0, limit: number = 10): Promise<Notification[]> {
    return this.notificationModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // Most recent first
      .lean()
      .exec() as Promise<Notification[]>;
  }

  async findById(id: string): Promise<Notification | null> {
    return this.notificationModel.findById(id).lean().exec() as Promise<Notification | null>;
  }

  async update(id: string, data: Partial<Notification>): Promise<Notification | null> {
    return this.notificationModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec() as Promise<Notification | null>;
  }

  async delete(id: string): Promise<Notification | null> {
    return this.notificationModel
      .findByIdAndDelete(id)
      .lean()
      .exec() as Promise<Notification | null>;
  }

  async count(): Promise<number> {
    return this.notificationModel.countDocuments().exec();
  }

  /**
   * Relationship Management Methods
   */
}
