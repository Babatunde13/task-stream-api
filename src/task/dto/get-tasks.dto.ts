import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class GetTasksDto {
  @ApiProperty({
    description: 'Task status',
    required: false,
    default: TaskStatus.OPEN,
    enum: Object.values(TaskStatus),
  })
  @IsEnum(Object.values(TaskStatus))
  readonly status?: TaskStatus;
}
