import { Controller, Get, Param } from '@nestjs/common';
import { User } from 'src/database/entity/user.entity';
import { UsersService } from './users.service';
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/get')
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }
  @Get('/get/:id')
  async findOne(@Param('id') id): Promise<User> {
    return await this.usersService.findOne(id);
  }
}
