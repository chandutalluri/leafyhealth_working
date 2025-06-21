import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { eq, and, gte, lte } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../schema';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const subscription = await this.db.insert(schema.subscriptions).values({
        id: crypto.randomUUID(),
        userId: createSubscriptionDto.userId,
        planType: createSubscriptionDto.planType,
        mealType: createSubscriptionDto.mealType,
        duration: createSubscriptionDto.duration,
        startDate: createSubscriptionDto.startDate,
        endDate: this.calculateEndDate(createSubscriptionDto.startDate, createSubscriptionDto.duration).toISOString().split('T')[0],
        deliveryTime: createSubscriptionDto.deliveryTime,
        branchId: createSubscriptionDto.branchId,
        totalPrice: createSubscriptionDto.totalPrice.toString(),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      // Create subscription items
      if (createSubscriptionDto.items && createSubscriptionDto.items.length > 0) {
        const subscriptionItems = createSubscriptionDto.items.map(item => ({
          id: crypto.randomUUID(),
          subscriptionId: subscription[0].id,
          productId: item.productId,
          quantity: item.quantity,
          dayOffset: item.dayOffset || 0,
          createdAt: new Date(),
        }));

        await this.db.insert(schema.subscriptionItems).values(subscriptionItems);
      }

      return {
        success: true,
        data: subscription[0],
        message: 'Subscription created successfully',
      };
    } catch (error) {
      throw new BadRequestException('Failed to create subscription');
    }
  }

  async getAllSubscriptions(userId?: string, status?: string) {
    try {
      let whereConditions = [];
      
      if (userId) {
        whereConditions.push(eq(schema.subscriptions.userId, userId));
      }
      
      if (status) {
        whereConditions.push(eq(schema.subscriptions.status, status));
      }

      const subscriptions = whereConditions.length > 0 
        ? await this.db
            .select()
            .from(schema.subscriptions)
            .where(and(...whereConditions))
        : await this.db.select().from(schema.subscriptions);

      return {
        success: true,
        data: subscriptions,
        count: subscriptions.length,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch subscriptions');
    }
  }

  async getActiveSubscriptions(userId: string) {
    try {
      const activeSubscriptions = await this.db
        .select()
        .from(schema.subscriptions)
        .where(
          and(
            eq(schema.subscriptions.userId, userId),
            eq(schema.subscriptions.status, 'active')
          )
        );

      return {
        success: true,
        data: activeSubscriptions,
        count: activeSubscriptions.length,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch active subscriptions');
    }
  }

  async getSubscriptionPlans() {
    const plans = [
      {
        id: 'breakfast-daily',
        name: 'Daily Breakfast',
        mealType: 'breakfast',
        duration: 1,
        price: 150,
        description: 'Fresh organic breakfast delivered daily',
        deliveryTime: '7:00-9:00 AM',
        items: ['Organic oats', 'Fresh fruits', 'Milk', 'Honey']
      },
      {
        id: 'lunch-daily',
        name: 'Daily Lunch',
        mealType: 'lunch',
        duration: 1,
        price: 250,
        description: 'Healthy lunch delivered fresh',
        deliveryTime: '12:00-2:00 PM',
        items: ['Rice/Roti', 'Vegetables', 'Dal', 'Salad']
      },
      {
        id: 'dinner-daily',
        name: 'Daily Dinner',
        mealType: 'dinner',
        duration: 1,
        price: 300,
        description: 'Nutritious dinner for your family',
        deliveryTime: '6:00-8:00 PM',
        items: ['Rice/Roti', 'Curry', 'Vegetables', 'Dessert']
      },
      {
        id: 'full-meal-weekly',
        name: 'Weekly Full Meals',
        mealType: 'all',
        duration: 7,
        price: 4500,
        description: 'Complete meal plan for a week',
        deliveryTime: 'Multiple slots',
        discount: '15% off',
        items: ['All meals included', 'Snacks', 'Beverages']
      },
      {
        id: 'full-meal-monthly',
        name: 'Monthly Full Meals',
        mealType: 'all',
        duration: 30,
        price: 18000,
        description: 'Complete monthly meal subscription',
        deliveryTime: 'Multiple slots',
        discount: '25% off',
        items: ['All meals included', 'Snacks', 'Beverages', 'Special meals']
      }
    ];

    return {
      success: true,
      data: plans,
    };
  }

  async getSubscriptionById(id: string) {
    try {
      const subscription = await this.db
        .select()
        .from(schema.subscriptions)
        .where(eq(schema.subscriptions.id, id));

      if (!subscription || subscription.length === 0) {
        throw new NotFoundException('Subscription not found');
      }

      // Get subscription items
      const items = await this.db
        .select()
        .from(schema.subscriptionItems)
        .where(eq(schema.subscriptionItems.subscriptionId, id));

      return {
        success: true,
        data: {
          ...subscription[0],
          items,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch subscription');
    }
  }

  async updateSubscription(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    try {
      const updateData: any = { ...updateSubscriptionDto, updatedAt: new Date() };
      if (updateData.totalPrice) {
        updateData.totalPrice = updateData.totalPrice.toString();
      }
      if (updateData.startDate) {
        updateData.startDate = updateData.startDate;
      }
      if (updateData.endDate) {
        updateData.endDate = updateData.endDate;
      }
      
      const updatedSubscription = await this.db
        .update(schema.subscriptions)
        .set(updateData)
        .where(eq(schema.subscriptions.id, id))
        .returning();

      if (!updatedSubscription || updatedSubscription.length === 0) {
        throw new NotFoundException('Subscription not found');
      }

      return {
        success: true,
        data: updatedSubscription[0],
        message: 'Subscription updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update subscription');
    }
  }

  async pauseSubscription(id: string) {
    return this.updateSubscriptionStatus(id, 'paused');
  }

  async resumeSubscription(id: string) {
    return this.updateSubscriptionStatus(id, 'active');
  }

  async cancelSubscription(id: string) {
    return this.updateSubscriptionStatus(id, 'cancelled');
  }

  private async updateSubscriptionStatus(id: string, status: string) {
    try {
      const updatedSubscription = await this.db
        .update(schema.subscriptions)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(eq(schema.subscriptions.id, id))
        .returning();

      if (!updatedSubscription || updatedSubscription.length === 0) {
        throw new NotFoundException('Subscription not found');
      }

      return {
        success: true,
        data: updatedSubscription[0],
        message: `Subscription ${status} successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to ${status} subscription`);
    }
  }

  async getDeliverySchedule(subscriptionId: string) {
    try {
      const schedule = await this.db
        .select()
        .from(schema.deliverySchedule)
        .where(eq(schema.deliverySchedule.subscriptionId, subscriptionId));

      return {
        success: true,
        data: schedule,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch delivery schedule');
    }
  }

  async generateDeliverySchedule(subscriptionId: string) {
    try {
      const subscription = await this.getSubscriptionById(subscriptionId);
      const subscriptionData = subscription.data;

      const scheduleEntries = [];
      const startDate = new Date(subscriptionData.startDate);
      const endDate = new Date(subscriptionData.endDate);

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        scheduleEntries.push({
          id: crypto.randomUUID(),
          subscriptionId,
          deliveryDate: d.toISOString().split('T')[0],
          deliveryTime: subscriptionData.deliveryTime,
          status: 'pending',
          createdAt: new Date(),
        });
      }

      await this.db.insert(schema.deliverySchedule).values(scheduleEntries);

      return {
        success: true,
        data: scheduleEntries,
        message: 'Delivery schedule generated successfully',
      };
    } catch (error) {
      throw new BadRequestException('Failed to generate delivery schedule');
    }
  }

  private calculateEndDate(startDate: string, duration: number): Date {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + duration);
    return end;
  }
}