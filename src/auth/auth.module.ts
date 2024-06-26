import { Logger as LoggerService, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ResponseService } from '../responses/response.service';
import { User, UserSchema } from './user.entity';
import { ResponseModule } from '../responses/response.module';

@Module({
  imports: [
    ResponseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, ResponseService, LoggerService],
})
export class AuthModule {}
