import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { User } from '../auth/user.entity';
import { verifyToken } from '../utils';

type JwtUser = {
  id: string;
  email: string;
};
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private async findUserById(id: string) {
    return this.userModel.findById(id);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }
    const decoded = await this.validateToken(request.headers.authorization);
    request.user = decoded;
    return true;
  }

  private async validateToken(auth: string) {
    if (auth?.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }
    const token = auth.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      const authUser = decoded as JwtPayload;
      if (authUser && this.isUser(authUser)) {
        const user = await this.findUserById(authUser.id);

        if (!user) {
          throw new HttpException(
            'Unauthorized access',
            HttpStatus.UNAUTHORIZED,
          );
        }
        return user;
      }
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    } catch (e) {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }
  }

  private isUser(user: any): user is JwtUser {
    return user.id && user.email;
  }
}
