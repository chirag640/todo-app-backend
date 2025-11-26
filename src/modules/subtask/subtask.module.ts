import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subtask, SubtaskSchema } from './schemas/subtask.schema';
import { SubtaskController } from './subtask.controller';
import { SubtaskService } from './subtask.service';
import { SubtaskRepository } from './subtask.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subtask.name, schema: SubtaskSchema }])],
  controllers: [SubtaskController],
  providers: [SubtaskService, SubtaskRepository],
  exports: [SubtaskService],
})
export class SubtaskModule {}
