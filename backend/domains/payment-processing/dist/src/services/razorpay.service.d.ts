export interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
}
export interface RazorpayPayment {
    id: string;
    order_id: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    captured: boolean;
    created_at: number;
}
export declare class RazorpayService {
    private readonly logger;
    private keyId;
    private keySecret;
    private baseUrl;
    constructor(keyId?: string, keySecret?: string);
    private validateCredentials;
    getKeyId(): string;
    private getAuthHeader;
    createOrder(amount: number, currency: string, orderId: string): Promise<RazorpayOrder>;
    verifyPayment(paymentId: string, orderId: string, signature: string, webhookSecret?: string): boolean;
    capturePayment(paymentId: string, amount: number): Promise<RazorpayPayment>;
    refundPayment(paymentId: string, amount?: number): Promise<any>;
    getPayment(paymentId: string): Promise<RazorpayPayment>;
    verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
}
