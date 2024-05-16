import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({
    description: 'User id',
    required: true,
    default: '1',
  })
  _id: string;

  @Prop()
  @ApiProperty({
    description: 'User first name',
    required: true,
    default: 'John',
  })
  fullame: string;

  @Prop({
    unique: true,
  })
  @ApiProperty({
    description: 'User email',
    required: true,
  })
  email: string;

  @Prop()
  password: string;

  @ApiProperty({
    description: 'User created at',
    required: true,
    default: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User updated at',
    required: true,
    default: new Date(),
  })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
