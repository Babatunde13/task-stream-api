import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class UpdateTaskStatusDto {
  @ApiProperty({
    description: 'Task status',
    required: true,
    default: TaskStatus.OPEN,
    enum: Object.values(TaskStatus),
  })
  @IsEnum(Object.values(TaskStatus))
  readonly status: TaskStatus;
}
