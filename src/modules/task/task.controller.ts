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
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskOutputDto } from './dto/task-output.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTaskDto): Promise<TaskOutputDto> {
    return this.taskService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('priority') priority?: string,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
    @Query('dateFilter') dateFilter?: string,
  ) {
    return this.taskService.findAll(page, limit, {
      search,
      priority,
      status,
      sortBy,
      order,
      dateFilter,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TaskOutputDto> {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto): Promise<TaskOutputDto> {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.taskService.remove(id);
  }
}
