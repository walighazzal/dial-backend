import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Users } from './user.entity';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') rpp: number,
    @Query('search') search?: string,
    @Query('filter') filter?: string,
    @Query('orderBy') orderBy?: string,
  ) {
    const options: IPaginationOptions | undefined =
      page && rpp
        ? {
            page: Number(page),
            limit: Number(rpp),
          }
        : undefined;

    const parsedFilter = filter ? JSON.parse(filter) : undefined;

    return this.userService.findAll(options, search, parsedFilter, orderBy);
  }

  @Get(':id')
  findOne(@Param('id') userId: string): Promise<Partial<Users>> {
    return this.userService.findOne(userId);
  }

  @Post()
  create(
    @Body() body: CreateUserDto,
    @Req() req: Request,
  ): Promise<Partial<Users>> {
    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    return this.userService.create(body, req.headers.origin);
  }

  @Post('validate')
  async validateUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<Partial<Users>> {
    return this.userService.validateUserPassword(email, password);
  }

  @Put(':id/changePassword')
  async updatePassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    if (body.password !== body.confirmPassword) {
      throw new BadRequestException(
        'New password and confirmation do not match',
      );
    }
    return this.userService.updatePassword(id, body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Req() req,
  ): Promise<Partial<Users>> {
    return this.userService.update(id, { ...body, userRole: req.user.roleId });
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.userService.softDelete(id);
  }

  // @Post('reset-password')
  // async resetPassword(
  //   @Body() body,
  // ): Promise<{ resetToken: string }> {
  //   return this.userService.generateResetPasswordToken(body.email);
  // }
}
