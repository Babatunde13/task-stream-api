import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Task title',
    required: true,
    default: 'Task title',
  })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty({
    description: 'Task description',
    required: true,
    default: 'Task description',
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    description: 'Task priority',
    required: true,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  readonly priority?: number;

  @ApiProperty({
    description: 'Task due date',
    required: true,
    default: new Date(),
  })
  @IsOptional()
  @IsDateString()
  readonly dueDate?: Date;
}
