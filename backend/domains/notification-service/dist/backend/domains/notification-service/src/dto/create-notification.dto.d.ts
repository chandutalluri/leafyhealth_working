export declare enum NotificationType {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    IN_APP = "in_app"
}
export declare enum NotificationChannel {
    ORDER = "order",
    PAYMENT = "payment",
    INVENTORY = "inventory",
    SYSTEM = "system"
}
export declare enum NotificationPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class CreateNotificationDto {
    userId?: number;
    type: NotificationType;
    channel: NotificationChannel;
    title: string;
    message: string;
    data?: any;
    priority?: NotificationPriority;
    scheduledAt?: string;
}
