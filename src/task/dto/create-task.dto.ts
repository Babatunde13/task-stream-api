import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    required: true,
    default: 'Task title',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Task description',
    required: true,
    default: 'Task description',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Task priority',
    required: true,
    default: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly priority: number;

  @ApiProperty({
    description: 'Task due date',
    required: true,
    default: new Date(),
  })
  @IsNotEmpty()
  @IsDateString()
  readonly dueDate: string;
}
