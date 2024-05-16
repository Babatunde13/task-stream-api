import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ResponseService } from '../response/response.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/user.entity';
import { Task, TaskSchema } from './task.entity';
import { ResponseModule } from '../response/response.module';

@Module({
  imports: [
    ResponseModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService, ResponseService],
})
export class TaskModule {}
