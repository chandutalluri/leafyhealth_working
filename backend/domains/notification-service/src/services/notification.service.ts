import { Injectable } from '@nestjs/common';
import { eq, desc, and } from 'drizzle-orm';
import { db } from '../database';
import { notifications, notificationTemplates, notificationPreferences, type Notification, type InsertNotification } from '../database';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class NotificationService {
  async create(createNotificationDto: CreateNotificationDto): Promise<{ success: boolean; message: string; data: Notification }> {
    try {
      const notificationData: InsertNotification = {
        ...createNotificationDto,
        scheduledAt: createNotificationDto.scheduledAt ? new Date(createNotificationDto.scheduledAt) : undefined,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const [notification] = await db
        .insert(notifications)
        .values(notificationData)
        .returning();

      return {
        success: true,
        message: 'Notification created successfully',
        data: notification
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  async findAll(userId?: number): Promise<Notification[]> {
    try {
      const query = db.select().from(notifications);
      
      if (userId) {
        return await query.where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
      }
      
      return await query.orderBy(desc(notifications.createdAt));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  async findOne(id: number): Promise<Notification | null> {
    try {
      const [notification] = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, id));

      return notification || null;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw new Error('Failed to fetch notification');
    }
  }

  async markAsRead(id: number): Promise<{ success: boolean; message: string }> {
    try {
      await db
        .update(notifications)
        .set({ 
          status: 'read',
          readAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(notifications.id, id));

      return {
        success: true,
        message: 'Notification marked as read'
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  async markAsSent(id: number): Promise<{ success: boolean; message: string }> {
    try {
      await db
        .update(notifications)
        .set({ 
          status: 'sent',
          sentAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(notifications.id, id));

      return {
        success: true,
        message: 'Notification marked as sent'
      };
    } catch (error) {
      console.error('Error marking notification as sent:', error);
      throw new Error('Failed to mark notification as sent');
    }
  }

  async findByStatus(status: string): Promise<Notification[]> {
    try {
      return await db
        .select()
        .from(notifications)
        .where(eq(notifications.status, status))
        .orderBy(desc(notifications.createdAt));
    } catch (error) {
      console.error('Error fetching notifications by status:', error);
      throw new Error('Failed to fetch notifications by status');
    }
  }

  async findByChannel(channel: string): Promise<Notification[]> {
    try {
      return await db
        .select()
        .from(notifications)
        .where(eq(notifications.channel, channel))
        .orderBy(desc(notifications.createdAt));
    } catch (error) {
      console.error('Error fetching notifications by channel:', error);
      throw new Error('Failed to fetch notifications by channel');
    }
  }

  async getUnreadCount(userId: number): Promise<number> {
    try {
      const result = await db
        .select()
        .from(notifications)
        .where(and(
          eq(notifications.userId, userId),
          eq(notifications.status, 'pending')
        ));

      return result.length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw new Error('Failed to get unread count');
    }
  }
}