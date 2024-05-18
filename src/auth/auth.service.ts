import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger as LoggerService,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  comparePasswordHash,
  generatePasswordhash,
  getJwtToken,
} from '../utils';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly logger: LoggerService,
  ) {
    this.logger = new LoggerService(AuthService.name);
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await generatePasswordhash(registerDto.password);

    const user = {
      email: registerDto.email.toLowerCase(),
      password: hashedPassword,
      fullname: registerDto.fullname,
    };
    const savedUser = await this.userModel.create(user);
    const resp = savedUser.toJSON();
    delete resp.password;

    this.logger.debug(`Account created`, {
      context: AuthService.name,
      type: 'register',
      category: 'auth',
      user: savedUser.id,
    });

    return resp;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({
      email: loginDto.email.toLowerCase(),
    });
    if (!user) {
      this.logger.error(`Email not found`, {
        context: AuthService.name,
        type: 'login',
        category: 'auth',
        email: loginDto.email,
      });

      throw new NotFoundException('Invalid email or password');
    }

    const isPasswordMatch = await comparePasswordHash(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      this.logger.error(`Invalid password`, {
        context: AuthService.name,
        type: 'login',
        category: 'auth',
        email: loginDto.email,
      });
      throw new BadRequestException('Invalid email or password');
    }

    const userObj = user.toJSON();
    delete userObj.password;

    const token = getJwtToken({ id: user.id, email: user.email });
    this.logger.debug(`User logged in`, {
      context: AuthService.name,
      type: 'login',
      category: 'auth',
      user: user.id,
    });
    return {
      user: userObj,
      token,
    };
  }
}
