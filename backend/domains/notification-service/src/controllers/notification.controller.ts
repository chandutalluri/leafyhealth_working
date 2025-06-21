import { Controller, Get, Post, Body, Param, Query, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

// Bearer auth disabled
// Auth disabled for development
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return await this.notificationService.create(createNotificationDto);
  }

  @Get()
  async findAll(@Query('userId') userId?: string) {
    const userIdNum = userId ? parseInt(userId) : undefined;
    return await this.notificationService.findAll(userIdNum);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string) {
    return await this.notificationService.findByStatus(status);
  }

  @Get('channel/:channel')
  async findByChannel(@Param('channel') channel: string) {
    return await this.notificationService.findByChannel(channel);
  }

  @Get('unread-count/:userId')
  async getUnreadCount(@Param('userId') userId: string) {
    const userIdNum = parseInt(userId);
    const count = await this.notificationService.getUnreadCount(userIdNum);
    return { count };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.notificationService.findOne(parseInt(id));
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return await this.notificationService.markAsRead(parseInt(id));
  }

  @Put(':id/sent')
  async markAsSent(@Param('id') id: string) {
    return await this.notificationService.markAsSent(parseInt(id));
  }
}