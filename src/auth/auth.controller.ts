import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseService } from '../responses/response.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponse, RegisterResponse } from '../responses/success.response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiOkResponse({
    type: RegisterResponse,
    description: 'Create account',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const response = await this.authService.register(registerDto);
    return this.responseService.successResponse(
      response,
      'Account created successfully',
    );
  }

  @ApiOkResponse({
    type: LoginResponse,
    description: 'Login user',
  })
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const response = await this.authService.login(loginDto);
    return this.responseService.successResponse(response, 'Login successful');
  }
}
