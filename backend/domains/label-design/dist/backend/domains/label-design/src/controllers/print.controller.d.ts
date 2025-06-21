import { PrintService } from '../services/print.service';
import { CreatePrintJobDto, PrintPriority } from '../dto/create-print-job.dto';
export declare class PrintController {
    private readonly printService;
    constructor(printService: PrintService);
    createPrintJob(createPrintJobDto: CreatePrintJobDto): Promise<{
        id: number;
        name: string;
        labelIds: number[];
        printerId: string;
        copies: number;
        priority: PrintPriority;
        quality: string;
        paperType: string;
        status: string;
        scheduledFor: Date;
        createdAt: string;
        estimatedCompletionTime: string;
        totalLabels: number;
    }>;
    getPrintJobs(status?: string, priority?: PrintPriority): Promise<({
        id: number;
        name: string;
        labelIds: number[];
        printerId: string;
        copies: number;
        priority: PrintPriority;
        status: string;
        totalLabels: number;
        createdAt: string;
        completedAt: string;
        progress?: undefined;
        scheduledFor?: undefined;
    } | {
        id: number;
        name: string;
        labelIds: number[];
        printerId: string;
        copies: number;
        priority: PrintPriority;
        status: string;
        totalLabels: number;
        createdAt: string;
        progress: number;
        completedAt?: undefined;
        scheduledFor?: undefined;
    } | {
        id: number;
        name: string;
        labelIds: number[];
        printerId: string;
        copies: number;
        priority: PrintPriority;
        status: string;
        totalLabels: number;
        createdAt: string;
        scheduledFor: string;
        completedAt?: undefined;
        progress?: undefined;
    })[]>;
    getPrintJobById(id: number): Promise<{
        id: number;
        name: string;
        labelIds: number[];
        printerId: string;
        copies: number;
        priority: PrintPriority;
        quality: string;
        paperType: string;
        status: string;
        totalLabels: number;
        progress: number;
        createdAt: string;
        startedAt: string;
        estimatedCompletionTime: string;
        labels: {
            id: number;
            name: string;
            copies: number;
        }[];
    }>;
    cancelPrintJob(id: number): Promise<{
        jobId: number;
        status: string;
        cancelledAt: string;
        message: string;
    }>;
    getPrinters(): Promise<({
        id: string;
        name: string;
        type: string;
        location: string;
        status: string;
        capabilities: string[];
        paperTypes: string[];
        currentJob: string;
        queueLength: number;
        lastError?: undefined;
    } | {
        id: string;
        name: string;
        type: string;
        location: string;
        status: string;
        capabilities: string[];
        paperTypes: string[];
        currentJob: any;
        queueLength: number;
        lastError: string;
    })[]>;
    getQueueStatus(): Promise<{
        totalJobs: number;
        activeJobs: number;
        queuedJobs: number;
        scheduledJobs: number;
        currentQueue: ({
            id: number;
            name: string;
            priority: PrintPriority;
            totalLabels: number;
            progress: number;
            estimatedTimeRemaining: string;
            position?: undefined;
        } | {
            id: number;
            name: string;
            priority: PrintPriority;
            totalLabels: number;
            position: number;
            progress?: undefined;
            estimatedTimeRemaining?: undefined;
        })[];
    }>;
    getPrintingStats(): Promise<{
        today: {
            jobsCompleted: number;
            labelsPressed: number;
            averageJobTime: string;
            successRate: number;
        };
        thisWeek: {
            jobsCompleted: number;
            labelsPressed: number;
            mostActiveDay: string;
            busyHours: string[];
        };
        printers: {
            totalActive: number;
            totalOffline: number;
            mostUsed: string;
            maintenanceNeeded: string[];
        };
        consumption: {
            standardPaper: number;
            adhesivePaper: number;
            waterproofPaper: number;
            inkUsage: string;
        };
    }>;
}
