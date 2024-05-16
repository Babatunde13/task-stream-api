import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'Full name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly fullname: string;

  @ApiProperty({
    description: 'Password',
    required: true,
  })
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minSymbols: 1,
      minLowercase: 1,
      minNumbers: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password must be at least 8 characters long, and contain at least one symbol, one lowercase letter, one uppercase letter, and one number.',
    },
  )
  readonly password: string;
}
