import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncCursor, SyncCursorSchema } from './schemas/sync-cursor.schema';
import { SyncCursorController } from './sync-cursor.controller';
import { SyncCursorService } from './sync-cursor.service';
import { SyncCursorRepository } from './sync-cursor.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: SyncCursor.name, schema: SyncCursorSchema }])],
  controllers: [SyncCursorController],
  providers: [SyncCursorService, SyncCursorRepository],
  exports: [SyncCursorService],
})
export class SyncCursorModule {}
