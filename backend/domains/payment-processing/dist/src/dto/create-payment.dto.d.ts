export declare class CreatePaymentDto {
    orderId: string;
    amount: number;
    currency?: string;
    gateway: string;
    paymentMethodId?: string;
    customerEmail: string;
    customerPhone?: string;
    returnUrl?: string;
    webhookUrl?: string;
}
