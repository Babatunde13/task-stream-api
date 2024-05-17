import { ApiProperty } from '@nestjs/swagger';
import { User } from '../auth/user.entity';
import { Task } from '../task/task.entity';

abstract class SuccessApiResponse {
  @ApiProperty({ default: true })
  success?: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ default: 'success' })
  status: string;
}

export class HelloResponse extends SuccessApiResponse {
  @ApiProperty()
  data: string;
}

export class Login {
  @ApiProperty({ description: 'JWT token' })
  token: string;

  @ApiProperty()
  user: User;
}

export class TasksResponse extends SuccessApiResponse {
  @ApiProperty({ type: [Task] })
  data: Task[];
}

export class LoginResponse extends SuccessApiResponse {
  @ApiProperty({ type: Login })
  data: Login;
}

export class TaskResponse extends SuccessApiResponse {
  @ApiProperty({ type: Task })
  data: Task;
}

export class RegisterResponse extends SuccessApiResponse {
  @ApiProperty()
  data: User;
}
