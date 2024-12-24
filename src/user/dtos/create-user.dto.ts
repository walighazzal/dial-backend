import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  roleId: string;

  @IsString()
  roleName: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  confirmPassword: string;

  @IsString()
  createdBy: string;
}
