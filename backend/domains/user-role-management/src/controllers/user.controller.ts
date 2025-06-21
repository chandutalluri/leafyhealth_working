import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiTags('Users')
// Bearer auth disabled
// Auth disabled for development
@Controller('users')
// Auth disabled for development
// Bearer auth disabled
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(@Request() req) {
    const users = await this.userService.findAll();
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    const user = await this.userService.create(createUserDto);
    return {
      success: true,
      message: 'User created successfully',
      data: user
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const user = await this.userService.update(parseInt(id), updateUserDto);
    return {
      success: true,
      message: 'User updated successfully',
      data: user
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.userService.remove(parseInt(id));
    return {
      success: true,
      message: 'User deleted successfully'
    };
  }

  @Post(':id/assign-role')
  @ApiOperation({ summary: 'Assign role to user' })
  async assignRole(@Param('id') id: string, @Body('role') role: string, @Request() req) {
    const user = await this.userService.assignRole(parseInt(id), role);
    return {
      success: true,
      message: 'Role assigned successfully',
      data: user
    };
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: 'Get user permissions' })
  async getPermissions(@Param('id') id: string) {
    const permissions = await this.userService.getUserPermissions(parseInt(id));
    return {
      success: true,
      message: 'Permissions retrieved successfully',
      data: permissions
    };
  }
}