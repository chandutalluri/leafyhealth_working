"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const database_2 = require("../database");
let NotificationService = class NotificationService {
    async create(createNotificationDto) {
        try {
            const notificationData = {
                ...createNotificationDto,
                scheduledAt: createNotificationDto.scheduledAt ? new Date(createNotificationDto.scheduledAt) : undefined,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const [notification] = await database_1.db
                .insert(database_2.notifications)
                .values(notificationData)
                .returning();
            return {
                success: true,
                message: 'Notification created successfully',
                data: notification
            };
        }
        catch (error) {
            console.error('Error creating notification:', error);
            throw new Error('Failed to create notification');
        }
    }
    async findAll(userId) {
        try {
            const query = database_1.db.select().from(database_2.notifications);
            if (userId) {
                return await query.where((0, drizzle_orm_1.eq)(database_2.notifications.userId, userId)).orderBy((0, drizzle_orm_1.desc)(database_2.notifications.createdAt));
            }
            return await query.orderBy((0, drizzle_orm_1.desc)(database_2.notifications.createdAt));
        }
        catch (error) {
            console.error('Error fetching notifications:', error);
            throw new Error('Failed to fetch notifications');
        }
    }
    async findOne(id) {
        try {
            const [notification] = await database_1.db
                .select()
                .from(database_2.notifications)
                .where((0, drizzle_orm_1.eq)(database_2.notifications.id, id));
            return notification || null;
        }
        catch (error) {
            console.error('Error fetching notification:', error);
            throw new Error('Failed to fetch notification');
        }
    }
    async markAsRead(id) {
        try {
            await database_1.db
                .update(database_2.notifications)
                .set({
                status: 'read',
                readAt: new Date(),
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(database_2.notifications.id, id));
            return {
                success: true,
                message: 'Notification marked as read'
            };
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
            throw new Error('Failed to mark notification as read');
        }
    }
    async markAsSent(id) {
        try {
            await database_1.db
                .update(database_2.notifications)
                .set({
                status: 'sent',
                sentAt: new Date(),
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(database_2.notifications.id, id));
            return {
                success: true,
                message: 'Notification marked as sent'
            };
        }
        catch (error) {
            console.error('Error marking notification as sent:', error);
            throw new Error('Failed to mark notification as sent');
        }
    }
    async findByStatus(status) {
        try {
            return await database_1.db
                .select()
                .from(database_2.notifications)
                .where((0, drizzle_orm_1.eq)(database_2.notifications.status, status))
                .orderBy((0, drizzle_orm_1.desc)(database_2.notifications.createdAt));
        }
        catch (error) {
            console.error('Error fetching notifications by status:', error);
            throw new Error('Failed to fetch notifications by status');
        }
    }
    async findByChannel(channel) {
        try {
            return await database_1.db
                .select()
                .from(database_2.notifications)
                .where((0, drizzle_orm_1.eq)(database_2.notifications.channel, channel))
                .orderBy((0, drizzle_orm_1.desc)(database_2.notifications.createdAt));
        }
        catch (error) {
            console.error('Error fetching notifications by channel:', error);
            throw new Error('Failed to fetch notifications by channel');
        }
    }
    async getUnreadCount(userId) {
        try {
            const result = await database_1.db
                .select()
                .from(database_2.notifications)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(database_2.notifications.userId, userId), (0, drizzle_orm_1.eq)(database_2.notifications.status, 'pending')));
            return result.length;
        }
        catch (error) {
            console.error('Error getting unread count:', error);
            throw new Error('Failed to get unread count');
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)()
], NotificationService);
//# sourceMappingURL=notification.service.js.map