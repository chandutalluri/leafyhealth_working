export declare class CreateMetricDto {
    serviceName: string;
    metricName: string;
    value: number;
    unit?: string;
    timestamp?: Date;
    tags?: any;
}
declare const UpdateMetricDto_base: import("@nestjs/common").Type<Partial<CreateMetricDto>>;
export declare class UpdateMetricDto extends UpdateMetricDto_base {
}
export {};
