export declare class CreateOrderItemDto {
    productId: number;
    quantity: number;
    unitPrice: string;
    notes?: string;
}
export declare class CreateOrderDto {
    customerId?: number;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    orderType?: string;
    shippingAddress?: string;
    billingAddress?: string;
    specialInstructions?: string;
    promoCode?: string;
    items: CreateOrderItemDto[];
}
