import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    create(createNotificationDto: CreateNotificationDto): Promise<{
        success: boolean;
        message: string;
        data: import("../database").Notification;
    }>;
    findAll(userId?: string): Promise<{
        id: number;
        data: unknown;
        type: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        channel: string;
        title: string;
        message: string;
        priority: string;
        scheduledAt: Date;
        sentAt: Date;
        readAt: Date;
    }[]>;
    findByStatus(status: string): Promise<{
        id: number;
        data: unknown;
        type: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        channel: string;
        title: string;
        message: string;
        priority: string;
        scheduledAt: Date;
        sentAt: Date;
        readAt: Date;
    }[]>;
    findByChannel(channel: string): Promise<{
        id: number;
        data: unknown;
        type: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        channel: string;
        title: string;
        message: string;
        priority: string;
        scheduledAt: Date;
        sentAt: Date;
        readAt: Date;
    }[]>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    findOne(id: string): Promise<{
        id: number;
        data: unknown;
        type: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        channel: string;
        title: string;
        message: string;
        priority: string;
        scheduledAt: Date;
        sentAt: Date;
        readAt: Date;
    }>;
    markAsRead(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAsSent(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
