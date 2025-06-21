"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintService = void 0;
const common_1 = require("@nestjs/common");
const create_print_job_dto_1 = require("../dto/create-print-job.dto");
let PrintService = class PrintService {
    async createPrintJob(createPrintJobDto) {
        const jobId = Math.floor(Math.random() * 1000) + 1;
        return {
            id: jobId,
            name: createPrintJobDto.name,
            labelIds: createPrintJobDto.labelIds,
            printerId: createPrintJobDto.printerId || 'default-printer',
            copies: createPrintJobDto.copies || 1,
            priority: createPrintJobDto.priority || create_print_job_dto_1.PrintPriority.NORMAL,
            quality: createPrintJobDto.quality || 'normal',
            paperType: createPrintJobDto.paperType || 'standard',
            status: createPrintJobDto.printImmediately ? 'printing' : 'queued',
            scheduledFor: createPrintJobDto.scheduledFor,
            createdAt: new Date().toISOString(),
            estimatedCompletionTime: this.calculateEstimatedTime(createPrintJobDto.labelIds.length, createPrintJobDto.copies || 1),
            totalLabels: createPrintJobDto.labelIds.length * (createPrintJobDto.copies || 1),
        };
    }
    async getPrintJobs(filters) {
        const baseJobs = [
            {
                id: 1,
                name: 'Daily Price Tags',
                labelIds: [1, 2, 3],
                printerId: 'printer-001',
                copies: 5,
                priority: create_print_job_dto_1.PrintPriority.HIGH,
                status: 'completed',
                totalLabels: 15,
                createdAt: '2024-01-18T08:00:00Z',
                completedAt: '2024-01-18T08:05:00Z',
            },
            {
                id: 2,
                name: 'Nutrition Labels Batch',
                labelIds: [4, 5, 6, 7],
                printerId: 'printer-002',
                copies: 2,
                priority: create_print_job_dto_1.PrintPriority.NORMAL,
                status: 'printing',
                totalLabels: 8,
                createdAt: '2024-01-18T09:30:00Z',
                progress: 62,
            },
            {
                id: 3,
                name: 'Promotional Tags',
                labelIds: [8, 9],
                printerId: 'printer-001',
                copies: 10,
                priority: create_print_job_dto_1.PrintPriority.LOW,
                status: 'queued',
                totalLabels: 20,
                createdAt: '2024-01-18T10:15:00Z',
                scheduledFor: '2024-01-18T14:00:00Z',
            },
        ];
        let filteredJobs = baseJobs;
        if (filters.status) {
            filteredJobs = filteredJobs.filter(job => job.status === filters.status);
        }
        if (filters.priority) {
            filteredJobs = filteredJobs.filter(job => job.priority === filters.priority);
        }
        return filteredJobs;
    }
    async getPrintJobById(id) {
        return {
            id,
            name: 'Sample Print Job',
            labelIds: [1, 2, 3],
            printerId: 'printer-001',
            copies: 5,
            priority: create_print_job_dto_1.PrintPriority.NORMAL,
            quality: 'high',
            paperType: 'adhesive',
            status: 'printing',
            totalLabels: 15,
            progress: 40,
            createdAt: '2024-01-18T09:00:00Z',
            startedAt: '2024-01-18T09:05:00Z',
            estimatedCompletionTime: '2024-01-18T09:12:00Z',
            labels: [
                { id: 1, name: 'Organic Apple Price Tag', copies: 5 },
                { id: 2, name: 'Fresh Bread Label', copies: 5 },
                { id: 3, name: 'Dairy Product Barcode', copies: 5 },
            ],
        };
    }
    async cancelPrintJob(id) {
        return {
            jobId: id,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
            message: 'Print job cancelled successfully',
        };
    }
    async getPrinters() {
        return [
            {
                id: 'printer-001',
                name: 'Label Printer Pro 3000',
                type: 'thermal',
                location: 'Main Counter',
                status: 'online',
                capabilities: ['2x1', '4x2', '4x6'],
                paperTypes: ['standard', 'adhesive', 'waterproof'],
                currentJob: 'Daily Price Tags',
                queueLength: 2,
            },
            {
                id: 'printer-002',
                name: 'Industrial Barcode Printer',
                type: 'inkjet',
                location: 'Warehouse',
                status: 'online',
                capabilities: ['2x1', '4x2', '4x6', 'custom'],
                paperTypes: ['standard', 'glossy', 'matte'],
                currentJob: null,
                queueLength: 0,
            },
            {
                id: 'printer-003',
                name: 'Nutrition Label Printer',
                type: 'laser',
                location: 'Food Prep Area',
                status: 'offline',
                capabilities: ['4x6'],
                paperTypes: ['standard', 'waterproof'],
                currentJob: null,
                queueLength: 1,
                lastError: 'Paper jam - requires attention',
            },
        ];
    }
    async getQueueStatus() {
        return {
            totalJobs: 8,
            activeJobs: 1,
            queuedJobs: 5,
            scheduledJobs: 2,
            currentQueue: [
                {
                    id: 2,
                    name: 'Nutrition Labels Batch',
                    priority: create_print_job_dto_1.PrintPriority.NORMAL,
                    totalLabels: 8,
                    progress: 62,
                    estimatedTimeRemaining: '3 minutes',
                },
                {
                    id: 4,
                    name: 'Emergency Recall Labels',
                    priority: create_print_job_dto_1.PrintPriority.URGENT,
                    totalLabels: 25,
                    position: 1,
                },
                {
                    id: 3,
                    name: 'Promotional Tags',
                    priority: create_print_job_dto_1.PrintPriority.LOW,
                    totalLabels: 20,
                    position: 2,
                },
            ],
        };
    }
    async getPrintingStats() {
        return {
            today: {
                jobsCompleted: 12,
                labelsPressed: 156,
                averageJobTime: '4.2 minutes',
                successRate: 98.7,
            },
            thisWeek: {
                jobsCompleted: 87,
                labelsPressed: 1243,
                mostActiveDay: 'Wednesday',
                busyHours: ['9:00-10:00', '14:00-15:00'],
            },
            printers: {
                totalActive: 2,
                totalOffline: 1,
                mostUsed: 'Label Printer Pro 3000',
                maintenanceNeeded: ['printer-003'],
            },
            consumption: {
                standardPaper: 245,
                adhesivePaper: 89,
                waterproofPaper: 23,
                inkUsage: '78%',
            },
        };
    }
    calculateEstimatedTime(labelCount, copies) {
        const totalLabels = labelCount * copies;
        const estimatedSeconds = totalLabels * 30;
        const estimatedTime = new Date(Date.now() + estimatedSeconds * 1000);
        return estimatedTime.toISOString();
    }
};
exports.PrintService = PrintService;
exports.PrintService = PrintService = __decorate([
    (0, common_1.Injectable)()
], PrintService);
//# sourceMappingURL=print.service.js.map