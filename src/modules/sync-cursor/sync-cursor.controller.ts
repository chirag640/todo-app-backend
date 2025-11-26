import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { SyncCursorService } from './sync-cursor.service';
import { CreateSyncCursorDto } from './dto/create-sync-cursor.dto';
import { UpdateSyncCursorDto } from './dto/update-sync-cursor.dto';
import { SyncCursorOutputDto } from './dto/sync-cursor-output.dto';

@Controller('synccursors')
export class SyncCursorController {
  constructor(private readonly syncCursorService: SyncCursorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateSyncCursorDto): Promise<SyncCursorOutputDto> {
    return this.syncCursorService.create(dto);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.syncCursorService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SyncCursorOutputDto> {
    return this.syncCursorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSyncCursorDto): Promise<SyncCursorOutputDto> {
    return this.syncCursorService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.syncCursorService.remove(id);
  }
}
