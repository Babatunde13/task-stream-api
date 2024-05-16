import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create_task.dto';
import { UpdateTaskDto } from './dto/update_task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/user.entity';
import { Model } from 'mongoose';
import { Task, TaskStatus } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async getTasks() {
    return this.taskModel.find();
  }

  async getTask(id: string) {
    return this.taskModel.findById(id);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    if (new Date(createTaskDto.dueDate) < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }
    const task = await this.taskModel.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
      priority: createTaskDto.priority,
      dueDate: new Date(createTaskDto.dueDate),
      owner: user._id,
    });

    task.owner = user;
    return task;
  }

  async getTasksByUser(userId: string) {
    return this.taskModel.find({ owner: userId });
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

    console.log(
      new Date(updateTaskDto.dueDate),
      new Date(updateTaskDto.dueDate) < new Date(),
      new Date(updateTaskDto.dueDate) || task.dueDate,
    );
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
    task.status = status;
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

    return task;
  }
}
