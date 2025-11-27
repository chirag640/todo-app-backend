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
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskOutputDto } from './dto/task-output.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTaskDto, @Req() req: any): Promise<TaskOutputDto> {
    return this.taskService.create(dto, req.user.userId);
  }

  @Get()
  findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('priority') priority?: string,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
    @Query('dateFilter') dateFilter?: string,
  ) {
    return this.taskService.findAll(req.user.userId, page, limit, {
      search,
      priority,
      status,
      sortBy,
      order,
      dateFilter,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any): Promise<TaskOutputDto> {
    return this.taskService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: any,
  ): Promise<TaskOutputDto> {
    return this.taskService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: any): Promise<void> {
    return this.taskService.remove(id, req.user.userId);
  }
}
