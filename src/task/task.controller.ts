import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { ResponseService } from '../responses/response.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AuthUser } from '../decorators/user.decorator';
import { TaskResponse, TasksResponse } from '../responses/success.response';

@ApiBearerAuth()
@ApiTags('tasks')
@UseGuards(AuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly responseService: ResponseService,
  ) {}

  private generateFilter(query: GetTasksDto, userId?: string) {
    const filter = {};
    if (userId) {
      filter['owner'] = userId;
    }

    if (query.status) {
      filter['status'] = query.status;
    }

    if (query.dueDate) {
      filter['dueDate'] = { $gte: query.dueDate };
    }
    return filter;
  }

  @ApiOkResponse({
    type: TasksResponse,
    description: 'Tasks fetched successfully',
  })
  @Get('/user')
  async getTasksByAuthUser(
    @AuthUser('id') userId: string,
    @Query() query: GetTasksDto,
  ) {
    const response = await this.taskService.getTasks(
      this.generateFilter(query, userId),
    );
    return this.responseService.successResponse(
      response,
      'Tasks fetched successfully',
    );
  }

  @ApiOkResponse({
    type: TasksResponse,
    description: 'Tasks fetched successfully',
  })
  @Get('/user/:id')
  async getTasksByUser(@Param('id') id: string, @Query() query: GetTasksDto) {
    const response = await this.taskService.getTasks(
      this.generateFilter(query, id),
    );
    return this.responseService.successResponse(
      response,
      'Task fetched successfully',
    );
  }

  @ApiOkResponse({
    type: TaskResponse,
    description: 'Task created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createTask(
    @AuthUser('id') userId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const response = await this.taskService.createTask(createTaskDto, userId);
    return this.responseService.successResponse(
      response,
      'Task created successfully',
    );
  }

  @ApiOkResponse({
    type: TasksResponse,
    description: 'Tasks fetched successfully',
  })
  @Get()
  async getTasks(@Query() query: GetTasksDto) {
    const response = await this.taskService.getTasks(
      this.generateFilter(query),
    );
    return this.responseService.successResponse(
      response,
      'Tasks fetched successfully',
    );
  }

  @ApiOkResponse({
    type: TaskResponse,
    description: 'Task fetched successfully',
  })
  @Get(':id')
  async getTask(@Param('id') id: string) {
    const response = await this.taskService.getTask(id);
    return this.responseService.successResponse(
      response,
      'Task fetched successfully',
    );
  }

  @ApiOkResponse({
    type: TaskResponse,
    description: 'Task updated successfully',
  })
  @Post(':id')
  async updateTask(
    @AuthUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const response = await this.taskService.updateTask(
      id,
      userId,
      updateTaskDto,
    );
    return this.responseService.successResponse(
      response,
      'Task updated successfully',
    );
  }

  @ApiOkResponse({
    type: TaskResponse,
    description: 'Task status updated successfully',
  })
  @Post(':id/status')
  async updateTaskStatus(
    @AuthUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const response = await this.taskService.updateTaskStatus(
      id,
      userId,
      updateTaskStatusDto.status,
    );
    return this.responseService.successResponse(
      response,
      'Task status updated successfully',
    );
  }

  @ApiOkResponse({
    type: TaskResponse,
    description: 'Task deleted successfully',
  })
  @Delete(':id/delete')
  async deleteTask(@AuthUser('id') userId: string, @Param('id') id: string) {
    const response = await this.taskService.deleteTask(id, userId);
    return this.responseService.successResponse(
      response,
      'Task deleted successfully',
    );
  }
}
