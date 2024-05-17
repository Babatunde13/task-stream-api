import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class GetTasksDto {
  @ApiProperty({
    description: 'Task status',
    required: false,
    enum: Object.values(TaskStatus),
  })
  @IsOptional()
  @IsEnum(Object.values(TaskStatus))
  readonly status?: TaskStatus;

  @ApiProperty({
    description: 'Task due date',
    required: false,
    default: new Date(),
  })
  @IsOptional()
  @IsDateString()
  readonly dueDate?: string;
}
