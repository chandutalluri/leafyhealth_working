import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';

@ApiTags('subscriptions')
@Controller('api/subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiOperation({ summary: 'Create new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(createSubscriptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions' })
  @ApiResponse({ status: 200, description: 'Subscriptions retrieved successfully' })
  async getAllSubscriptions(@Query('userId') userId?: string, @Query('status') status?: string) {
    return this.subscriptionService.getAllSubscriptions(userId, status);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active subscriptions for user' })
  @ApiResponse({ status: 200, description: 'Active subscriptions retrieved' })
  async getActiveSubscriptions(@Query('userId') userId: string) {
    return this.subscriptionService.getActiveSubscriptions(userId);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription plans' })
  @ApiResponse({ status: 200, description: 'Subscription plans retrieved' })
  async getSubscriptionPlans() {
    return this.subscriptionService.getSubscriptionPlans();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription by ID' })
  @ApiResponse({ status: 200, description: 'Subscription retrieved successfully' })
  async getSubscriptionById(@Param('id') id: string) {
    return this.subscriptionService.getSubscriptionById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update subscription' })
  @ApiResponse({ status: 200, description: 'Subscription updated successfully' })
  async updateSubscription(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto
  ) {
    return this.subscriptionService.updateSubscription(id, updateSubscriptionDto);
  }

  @Put(':id/pause')
  @ApiOperation({ summary: 'Pause subscription' })
  @ApiResponse({ status: 200, description: 'Subscription paused successfully' })
  async pauseSubscription(@Param('id') id: string) {
    return this.subscriptionService.pauseSubscription(id);
  }

  @Put(':id/resume')
  @ApiOperation({ summary: 'Resume subscription' })
  @ApiResponse({ status: 200, description: 'Subscription resumed successfully' })
  async resumeSubscription(@Param('id') id: string) {
    return this.subscriptionService.resumeSubscription(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled successfully' })
  async cancelSubscription(@Param('id') id: string) {
    return this.subscriptionService.cancelSubscription(id);
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Get delivery schedule for subscription' })
  @ApiResponse({ status: 200, description: 'Delivery schedule retrieved' })
  async getDeliverySchedule(@Param('id') id: string) {
    return this.subscriptionService.getDeliverySchedule(id);
  }

  @Post(':id/schedule')
  @ApiOperation({ summary: 'Generate delivery schedule' })
  @ApiResponse({ status: 201, description: 'Delivery schedule generated' })
  async generateDeliverySchedule(@Param('id') id: string) {
    return this.subscriptionService.generateDeliverySchedule(id);
  }

  @Get()
  @ApiOperation({ summary: 'Health check' })
  getHealth() {
    return {
      status: 'healthy',
      service: 'subscription-management',
      timestamp: new Date().toISOString(),
    };
  }
}