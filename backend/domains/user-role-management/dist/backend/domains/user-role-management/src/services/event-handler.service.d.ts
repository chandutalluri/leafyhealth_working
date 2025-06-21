import { OnModuleInit } from '@nestjs/common';
export declare class EventHandlerService implements OnModuleInit {
    onModuleInit(): Promise<void>;
    publishDomainEvent(eventType: string, data: any): Promise<void>;
}
