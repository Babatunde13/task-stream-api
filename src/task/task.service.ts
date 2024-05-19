import {
  BadRequestException,
  Injectable,
  Logger as LoggerService,
  NotFoundException,
} from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument, TaskStatus } from './task.entity';

@Injectable()
@WebSocketGateway({})
export class TaskService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private readonly io: Server;
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    private readonly logger: LoggerService,
  ) {}

  private emitEvent(event: string, data: any) {
    if (this.io) {
      this.io.sockets.emit(event, data);
    }
  }

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  async getTasks(filter: any = {}) {
    return this.taskModel
      .find(filter)
      .sort({
        priority: 'desc',
        dueDate: 'asc',
        createdAt: 'desc',
      })
      .populate({
        path: 'owner',
        select: '-password',
      });
  }

  async getTask(id: string) {
    return this.taskModel.findById(id).populate({
      path: 'owner',
      select: '-password',
    });
  }

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    if (new Date(createTaskDto.dueDate) < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }

    const task = await this.taskModel.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
      priority: createTaskDto.priority,
      dueDate: new Date(createTaskDto.dueDate),
      owner: userId,
    });

    await task.populate({
      path: 'owner',
      select: '-password',
    });

    this.emitEvent('task-created', task);
    return task;
  }

  async updateTask(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskModel.findOne({
      _id: id,
      owner: userId,
    });
    if (!task) {
      throw new NotFoundException(
        `Task with id ${id} not found for user with id ${userId}`,
      );
    }

    if (new Date(updateTaskDto.dueDate) < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }

    task.title = updateTaskDto.title || task.title;
    task.description = updateTaskDto.description || task.description;
    task.priority = updateTaskDto.priority || task.priority;
    task.dueDate =
      updateTaskDto.dueDate && new Date(updateTaskDto.dueDate) > new Date()
        ? new Date(updateTaskDto.dueDate)
        : task.dueDate;

    await task.save();

    await task.populate({
      path: 'owner',
      select: '-password',
    });

    this.emitEvent('task-updated', task);
    return task;
  }

  async updateTaskStatus(id: string, userId: string, status: TaskStatus) {
    const task = await this.taskModel.findOne({
      _id: id,
      owner: userId,
    });
    if (!task) {
      throw new NotFoundException(
        `Task with id ${id} not found for user with id ${userId}`,
      );
    }

    if (task.status === status) {
      throw new BadRequestException('Task is already in the same status');
    }

    if (task.status === TaskStatus.DONE) {
      throw new BadRequestException('Task is already completed');
    }

    if (task.status === TaskStatus.IN_PROGRESS && status === TaskStatus.OPEN) {
      throw new BadRequestException('Task is already in progress');
    }

    task.status = status;
    await task.save();

    await task.populate({
      path: 'owner',
      select: '-password',
    });

    this.emitEvent('task-updated', task);
    return task;
  }

  async deleteTask(id: string, userId: string) {
    const task = await this.taskModel.findOneAndDelete({
      _id: id,
      owner: userId,
    });

    if (!task) {
      throw new NotFoundException(
        `Task with id ${id} not found for user with id ${userId}`,
      );
    }

    this.emitEvent('task-deleted', task);
    return task;
  }
}
