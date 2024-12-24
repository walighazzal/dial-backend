import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { Users } from './user.entity';
import { Cron } from '@nestjs/schedule';
import { html } from 'src/email-Templates/accountCreation';
import { sendMail } from 'src/mailer';
import { constructQueryFromArray } from 'src/utility';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async findAll(
    options: IPaginationOptions,
    search?: string,
    filters?: Array<{ field: string; operator: string; value: any }>,
    orderBy?: any,
  ) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.andWhere(
        'user.firstName LIKE :search OR user.lastName LIKE :search',
        { search: `%${search}%` },
      );
    }

    if (filters && filters.length > 0) {
      const { queryString, queryObject } = constructQueryFromArray(filters);
      queryBuilder.andWhere(queryString, queryObject);
    }
    if (orderBy) {
      orderBy = JSON.parse(orderBy);
      queryBuilder.orderBy(orderBy);
    }
    const result = options
      ? await paginate<Users>(queryBuilder, options)
      : { items: await queryBuilder.getMany() };

    // Exclude the password field from the result
    const usersWithoutPassword = result.items.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return {
      ...result,
      items: usersWithoutPassword,
    };
  }

  async findByEmail(email: string): Promise<Users> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async validateUserPassword(
    email: string,
    password: string,
  ): Promise<Partial<Users>> {
    const user = await this.findByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }
    const { password: userPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findOne(userId: string): Promise<Partial<Users>> {
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(body: CreateUserDto, url): Promise<Partial<Users>> {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    body.password = hashedPassword;
    const createdUser = await this.userRepository.save(body);
    try {
      const response = await sendMail(
        createdUser.email,
        'Account Creation',
        html(`${createdUser.firstName} ${createdUser.lastName}`, url),
      );
    } catch (err) {
      console.error('Failed to send email on account creation:', err);

      this.emailRetryQueue.push({
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        retryAt: new Date(Date.now() + 10 * 1000), // Retry after 10 minutes
      });
    }

    const { password, confirmPassword, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  }

  async update(userId: string, user): Promise<Partial<Users>> {
    if (user.userRole != '0' && (user.password || user.confirmPassword)) {
      throw new NotFoundException(
        `You don't have permission to update password`,
      );
      // const { password, confirmPassword, ...userWithoutCreds } = user;
      // user = userWithoutCreds;
    }

    const { userRole, confirmPassword, ...userWithoutUserRole } = user;
    if (userWithoutUserRole.password !== confirmPassword) {
      throw new BadRequestException('Password and confirmation do not match');
    }
    // Hash and update the new password
    if (userWithoutUserRole.password) {
      const hashedPassword = await bcrypt.hash(
        userWithoutUserRole.password,
        10,
      );
      userWithoutUserRole.password = hashedPassword;
    }
    await this.userRepository.update(userId, userWithoutUserRole);
    const updatedUser = await this.userRepository.findOneBy({ userId });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async updatePassword(
    id: string,
    body: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const { oldPassword, password, confirmPassword } = body;

    if (password !== confirmPassword) {
      throw new BadRequestException('Password and confirmation do not match');
    }
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.userId = :id', { id: id })
      .addSelect('users.password')
      .getOne();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    console.log(user.password);
    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    const updatedUser = await this.userRepository.save(user);

    // const { password: userPassword, ...userWithoutPassword } = updatedUser;
    // return userWithoutPassword;
    return { message: 'Password updated successfully' };
  }

  async softDelete(userId: string): Promise<{ message: string }> {
    const deleteResult = await this.userRepository.softDelete(userId);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return { message: 'User deleted successfully' };
  }

  async findApprovers(): Promise<Users[]> {
    return this.userRepository.find({
      where: { roleId: In(['2', '0']) },
    });
  }

  emailRetryQueue: {
    email: string;
    firstName: string;
    lastName: string;
    retryAt: Date;
  }[] = [];

  @Cron('10 * * * *') // Runs every minute
  async handleEmailRetries() {
    const now = new Date();
    const offset = 5 * 60; // 5 hours in minutes
    const gmtPlusFive = new Date(now.getTime() + offset * 60 * 1000);
    const retryQueue = this.emailRetryQueue.filter(
      (item) => item.retryAt <= gmtPlusFive,
    );

    for (const item of retryQueue) {
      try {
        await sendMail(
          item.email,
          'Account Creation',
          html(`${item.firstName} ${item.lastName}`, item.email),
        );
        // Remove successfully sent emails from the queue
        this.emailRetryQueue.splice(this.emailRetryQueue.indexOf(item), 1);
      } catch (err) {
        console.error(`Failed to resend email to ${item.email}`, err);
      }
    }
  }
  async findAccountants(): Promise<Users[]> {
    return this.userRepository.find({
      where: { roleId: In(['5']) },
    });
  }
}
