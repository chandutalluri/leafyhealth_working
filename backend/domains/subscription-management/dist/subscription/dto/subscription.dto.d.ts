export declare class CreateSubscriptionItemDto {
    productId: string;
    quantity: number;
    dayOffset?: number;
}
export declare class CreateSubscriptionDto {
    userId: string;
    planType: string;
    mealType: string;
    duration: number;
    startDate: string;
    deliveryTime: string;
    branchId: string;
    totalPrice: number;
    items?: CreateSubscriptionItemDto[];
}
export declare class UpdateSubscriptionDto {
    planType?: string;
    mealType?: string;
    duration?: number;
    deliveryTime?: string;
    totalPrice?: number;
    status?: string;
}
