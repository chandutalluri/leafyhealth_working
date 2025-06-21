export declare class CreateDeliveryRouteDto {
    routeName: string;
    driverId: number;
    vehicleId: number;
    status?: string;
    totalDistance?: number;
    estimatedDuration?: number;
    shipmentIds?: number[];
    notes?: string;
}
