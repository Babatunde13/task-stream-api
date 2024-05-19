import { Logger as LoggerService, Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ResponseService } from '../responses/response.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/user.entity';
import { Task, TaskSchema } from './task.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService, ResponseService, LoggerService],
})
export class TaskModule {}
