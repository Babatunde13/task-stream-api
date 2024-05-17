import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../auth/user.entity';

export type TaskDocument = HydratedDocument<Task>;

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

// @ApiProperty()
@Schema({ timestamps: true })
export class Task {
  @ApiProperty({
    description: 'Task title',
    required: true,
    default: 'Task title',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'Task priority',
    required: true,
    default: 1,
  })
  @Prop({ min: 1, required: true, default: 1 })
  priority: number;

  @ApiProperty({
    description: 'Task description',
    required: true,
    default: 'Task description',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: 'Task due date',
    required: true,
    default: new Date(),
  })
  @Prop({ required: true, type: Date })
  dueDate: Date;

  @ApiProperty({
    description: 'Task status',
    required: true,
    default: TaskStatus.OPEN,
  })
  @Prop({ enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;

  @ApiProperty({
    description: 'Task owner',
    required: true,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @ApiProperty({
    description: 'Task created at',
    required: true,
    default: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Task updated at',
    required: true,
    default: new Date(),
  })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
