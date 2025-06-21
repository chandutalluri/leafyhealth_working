import { type Notification } from '../database';
import { CreateNotificationDto } from '../dto/create-notification.dto';
export declare class NotificationService {
    create(createNotificationDto: CreateNotificationDto): Promise<{
        success: boolean;
        message: string;
        data: Notification;
    }>;
    findAll(userId?: number): Promise<Notification[]>;
    findOne(id: number): Promise<Notification | null>;
    markAsRead(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    markAsSent(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    findByStatus(status: string): Promise<Notification[]>;
    findByChannel(channel: string): Promise<Notification[]>;
    getUnreadCount(userId: number): Promise<number>;
}
