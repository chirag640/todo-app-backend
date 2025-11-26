import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Device, DeviceDocument } from './schemas/device.schema';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class DeviceRepository extends BaseRepository<DeviceDocument> {
  constructor(
    @InjectModel(Device.name)
    private readonly deviceModel: Model<DeviceDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(deviceModel, connection);
  }

  async create(data: Partial<Device>): Promise<Device> {
    const created = new this.deviceModel(data);
    const saved = await created.save();
    return saved.toObject() as Device;
  }

  async findAll(skip: number = 0, limit: number = 10): Promise<Device[]> {
    return this.deviceModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // Most recent first
      .lean()
      .exec() as Promise<Device[]>;
  }

  async findById(id: string): Promise<Device | null> {
    return this.deviceModel.findById(id).lean().exec() as Promise<Device | null>;
  }

  async update(id: string, data: Partial<Device>): Promise<Device | null> {
    return this.deviceModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec() as Promise<Device | null>;
  }

  async delete(id: string): Promise<Device | null> {
    return this.deviceModel.findByIdAndDelete(id).lean().exec() as Promise<Device | null>;
  }

  async count(): Promise<number> {
    return this.deviceModel.countDocuments().exec();
  }

  /**
   * Relationship Management Methods
   */
}
