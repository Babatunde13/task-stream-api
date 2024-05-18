import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Patch,
  HttpCode,
  HttpStatus,
  Logger as LoggerService,
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
    private readonly logger: LoggerService,
  ) {
    this.logger = new LoggerService(TaskService.name);
  }

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
    try {
      this.logger.debug(`Tasks fetched`, {
        context: TaskService.name,
        type: 'get-tasks-by-auth-user',
        category: 'task',
        user: userId,
        query,
      });

      return this.responseService.successResponse(
        response,
        'Tasks fetched successfully',
      );
    } catch (error) {
      this.logger.error(`Error fetching tasks`, {
        context: TaskService.name,
        message: error.message,
        type: 'get-tasks-by-auth-user',
        category: 'task',
        user: userId,
        query,
      });

      throw error;
    }
  }

  @ApiOkResponse({
    type: TasksResponse,
    description: 'Tasks fetched successfully',
  })
  @Get('/user/:id')
  async getTasksByUser(@Param('id') id: string, @Query() query: GetTasksDto) {
    try {
      const response = await this.taskService.getTasks(
        this.generateFilter(query, id),
      );

      this.logger.debug(`Tasks fetched`, {
        context: TaskService.name,
        type: 'get-tasks-by-user',
        category: 'task',
        user: id,
        query,
      });

      return this.responseService.successResponse(
        response,
        'Task fetched successfully',
      );
    } catch (error) {
      this.logger.error(`Error fetching tasks`, {
        context: TaskService.name,
        message: error.message,
        type: 'get-tasks-by-user',
        category: 'task',
        user: id,
        query,
      });

      throw error;
    }
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
    try {
      const response = await this.taskService.createTask(createTaskDto, userId);

      this.logger.debug(`Task created`, {
        context: TaskService.name,
        type: 'create-task',
        category: 'task',
        user: userId,
        payload: createTaskDto,
      });

      return this.responseService.successResponse(
        response,
        'Task created successfully',
      );
    } catch (error) {
      this.logger.error(`Error creating task`, {
        context: TaskService.name,
        message: error.message,
        type: 'create-task',
        category: 'task',
        user: userId,
        payload: createTaskDto,
      });

      throw error;
    }
  }

  @ApiOkResponse({
    type: TasksResponse,
    description: 'Tasks fetched successfully',
  })
  @Get()
  async getTasks(@AuthUser('id') userId: string, @Query() query: GetTasksDto) {
    try {
      const response = await this.taskService.getTasks(
        this.generateFilter(query),
      );

      this.logger.debug(`Tasks fetched`, {
        context: TaskService.name,
        type: 'get-tasks',
        category: 'task',
        user: userId,
        query,
      });

      return this.responseService.successResponse(
        response,
        'Tasks fetched successfully',
      );
    } catch (error) {
      this.logger.error(`Error fetching tasks`, {
        context: TaskService.name,
        message: error.message,
        type: 'get-tasks',
        category: 'task',
        user: userId,
        query,
      });

      throw error;
    }
  }

  @ApiOkResponse({
    type: TaskResponse,
    description: 'Task fetched successfully',
  })
  @Get(':id')
  async getTask(@AuthUser('id') userId: string, @Param('id') id: string) {
    try {
      const response = await this.taskService.getTask(id);

      this.logger.debug(`Task fetched`, {
        context: TaskService.name,
        type: 'get-task',
        category: 'task',
        user: userId,
        taskID: id,
      });

      return this.responseService.successResponse(
        response,
        'Task fetched successfully',
      );
    } catch (error) {
      this.logger.error(`Error fetching task`, {
        context: TaskService.name,
        message: error.message,
        type: 'get-task',
        category: 'task',
        user: userId,
        taskID: id,
      });

      throw error;
    }
  }

  @ApiOkResponse({
    type: TaskResponse,
    description: 'Task updated successfully',
  })
  @Put(':id')
  async updateTask(
    @AuthUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    try {
      const response = await this.taskService.updateTask(
        id,
        userId,
        updateTaskDto,
      );

      this.logger.debug(`Task updated`, {
        context: TaskService.name,
        type: 'update-task',
        category: 'task',
        user: userId,
        taskID: id,
        payload: updateTaskDto,
      });

      return this.responseService.successResponse(
        response,
        'Task updated successfully',
      );
    } catch (error) {
      this.logger.error(`Error updating task`, {
        context: TaskService.name,
        message: error.message,
        type: 'update-task',
        category: 'task',
        user: userId,
        taskID: id,
        payload: updateTaskDto,
      });

      throw error;
    }
  }

  @ApiOkResponse({
    type: TaskResponse,
    description: 'Task status updated successfully',
  })
  @Patch(':id/status')
  async updateTaskStatus(
    @AuthUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    try {
      const response = await this.taskService.updateTaskStatus(
        id,
        userId,
        updateTaskStatusDto.status,
      );

      this.logger.debug(`Task status updated`, {
        context: TaskService.name,
        type: 'update-task-status',
        category: 'task',
        user: userId,
        taskID: id,
        payload: updateTaskStatusDto,
      });

      return this.responseService.successResponse(
        response,
        'Task status updated successfully',
      );
    } catch (error) {
      this.logger.error(`Error updating task status`, {
        context: TaskService.name,
        message: error.message,
        type: 'update-task-status',
        category: 'task',
        user: userId,
        taskID: id,
        payload: updateTaskStatusDto,
      });

      throw error;
    }
  }

  @ApiOkResponse({
    type: TaskResponse,
    description: 'Task deleted successfully',
  })
  @Delete(':id/delete')
  async deleteTask(@AuthUser('id') userId: string, @Param('id') id: string) {
    try {
      const response = await this.taskService.deleteTask(id, userId);

      this.logger.debug(`Task deleted`, {
        context: TaskService.name,
        type: 'delete-task',
        category: 'task',
        user: userId,
        taskID: id,
      });

      return this.responseService.successResponse(
        response,
        'Task deleted successfully',
      );
    } catch (error) {
      this.logger.error(`Error deleting task`, {
        context: TaskService.name,
        message: error.message,
        type: 'delete-task',
        category: 'task',
        user: userId,
        taskID: id,
      });

      throw error;
    }
  }
}
