import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  comparePasswordHash,
  generatePasswordhash,
  getJwtToken,
} from '../core/utils';
import { Model } from 'mongoose';
import { User } from './user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

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
    return resp;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({
      email: loginDto.email.toLowerCase(),
    });
    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    const isPasswordMatch = await comparePasswordHash(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    const userObj = user.toJSON();
    delete userObj.password;

    const token = getJwtToken({ id: user.id, email: user.email });
    return {
      user: userObj,
      token,
    };
  }
}
