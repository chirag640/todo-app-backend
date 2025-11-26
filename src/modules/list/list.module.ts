import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { List, ListSchema } from './schemas/list.schema';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { ListRepository } from './list.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: List.name, schema: ListSchema }])],
  controllers: [ListController],
  providers: [ListService, ListRepository],
  exports: [ListService],
})
export class ListModule {}
