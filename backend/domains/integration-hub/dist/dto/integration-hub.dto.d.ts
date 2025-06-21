export declare enum IntegrationType {
    API = "api",
    WEBHOOK = "webhook",
    DATABASE = "database",
    FILE_SYNC = "file_sync",
    MESSAGING = "messaging"
}
export declare class CreateIntegrationDto {
    name: string;
    type: IntegrationType;
    endpoint: string;
    apiKey?: string;
    configuration?: any;
    isActive?: boolean;
}
declare const UpdateIntegrationDto_base: import("@nestjs/common").Type<Partial<CreateIntegrationDto>>;
export declare class UpdateIntegrationDto extends UpdateIntegrationDto_base {
}
export {};
