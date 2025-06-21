import { IntegrationHubService } from '../services/integration-hub.service';
import { CreateIntegrationDto, UpdateIntegrationDto } from '../dto/integration-hub.dto';
export declare class IntegrationHubController {
    private readonly integrationHubService;
    constructor(integrationHubService: IntegrationHubService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        service: string;
    }>;
    createIntegration(createIntegrationDto: CreateIntegrationDto): Promise<{
        id: number;
        name: string;
        type: import("../dto/integration-hub.dto").IntegrationType;
        endpoint: string;
        apiKey: string;
        configuration: any;
        isActive: boolean;
        createdAt: Date;
    }>;
    getIntegrations(): Promise<any[]>;
    getIntegration(id: string): Promise<{
        id: number;
        name: string;
        type: string;
        endpoint: string;
        apiKey: string;
        configuration: {};
        isActive: boolean;
        createdAt: Date;
    }>;
    updateIntegration(id: string, updateIntegrationDto: UpdateIntegrationDto): Promise<{
        updatedAt: Date;
        name?: string;
        type?: import("../dto/integration-hub.dto").IntegrationType;
        endpoint?: string;
        apiKey?: string;
        configuration?: any;
        isActive?: boolean;
        id: number;
    }>;
    deleteIntegration(id: string): Promise<{
        message: string;
        deletedIntegration: {
            id: number;
            name: string;
        };
    }>;
    getIntegrationStatus(id: string): Promise<{
        id: number;
        name: string;
        status: string;
        lastSync: Date;
        health: string;
    }>;
    syncIntegration(id: string): Promise<{
        message: string;
        syncTimestamp: string;
    }>;
}
