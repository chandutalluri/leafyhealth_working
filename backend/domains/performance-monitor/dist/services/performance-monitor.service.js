"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitorService = void 0;
const common_1 = require("@nestjs/common");
let PerformanceMonitorService = class PerformanceMonitorService {
    constructor(database) {
        this.database = database;
    }
    async createMetric(createMetricDto) {
        const metric = {
            id: Math.floor(Math.random() * 10000),
            serviceName: createMetricDto.serviceName,
            metricName: createMetricDto.metricName,
            value: createMetricDto.value.toString(),
            unit: createMetricDto.unit,
            timestamp: createMetricDto.timestamp || new Date(),
            tags: createMetricDto.tags,
            createdAt: new Date()
        };
        return metric;
    }
    async getAllMetrics() {
        return [];
    }
    async getMetricById(id) {
        return {
            id,
            serviceName: 'performance-monitor',
            metricName: 'sample_metric',
            value: '100',
            unit: 'ms',
            timestamp: new Date(),
            tags: {},
            createdAt: new Date()
        };
    }
    async updateMetric(id, updateMetricDto) {
        return {
            id,
            ...updateMetricDto,
            updatedAt: new Date()
        };
    }
    async deleteMetric(id) {
        return {
            message: 'Metric deleted successfully',
            deletedMetric: { id, serviceName: 'performance-monitor' }
        };
    }
    async getServiceMetrics(serviceName) {
        return [];
    }
    async getDashboardOverview() {
        return {
            totalMetrics: 0,
            recentMetrics: [],
            services: ['performance-monitor'],
            lastUpdated: new Date().toISOString()
        };
    }
    async createAlert(alertData) {
        return {
            message: 'Alert created successfully',
            alertId: Math.random().toString(36).substr(2, 9),
            alertData,
            timestamp: new Date().toISOString()
        };
    }
};
exports.PerformanceMonitorService = PerformanceMonitorService;
exports.PerformanceMonitorService = PerformanceMonitorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [Object])
], PerformanceMonitorService);
//# sourceMappingURL=performance-monitor.service.js.map