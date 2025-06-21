import { db } from '../database/connection';
import { CreateIntegrationDto, UpdateIntegrationDto } from '../dto/integration-hub.dto';
export declare class IntegrationHubService {
    private database;
    constructor(database: typeof db);
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
    getAllIntegrations(): Promise<any[]>;
    getIntegrationById(id: number): Promise<{
        id: number;
        name: string;
        type: string;
        endpoint: string;
        apiKey: string;
        configuration: {};
        isActive: boolean;
        createdAt: Date;
    }>;
    updateIntegration(id: number, updateIntegrationDto: UpdateIntegrationDto): Promise<{
        updatedAt: Date;
        name?: string;
        type?: import("../dto/integration-hub.dto").IntegrationType;
        endpoint?: string;
        apiKey?: string;
        configuration?: any;
        isActive?: boolean;
        id: number;
    }>;
    deleteIntegration(id: number): Promise<{
        message: string;
        deletedIntegration: {
            id: number;
            name: string;
        };
    }>;
    getIntegrationStatus(id: number): Promise<{
        id: number;
        name: string;
        status: string;
        lastSync: Date;
        health: string;
    }>;
    syncIntegration(id: number): Promise<{
        message: string;
        syncTimestamp: string;
    }>;
}
