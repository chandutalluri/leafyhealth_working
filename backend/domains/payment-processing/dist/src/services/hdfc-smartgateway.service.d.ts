export interface HDFCPaymentRequest {
    orderId: string;
    amount: number;
    currency: string;
    customerEmail: string;
    customerPhone: string;
    returnUrl: string;
}
export interface HDFCPaymentResponse {
    encryptedData: string;
    merchantId: string;
    terminalId: string;
    paymentUrl: string;
}
export interface HDFCTransactionResponse {
    orderId: string;
    amount: number;
    currency: string;
    status: string;
    transactionId: string;
    isSuccess: boolean;
    errorMessage?: string;
}
export declare class HDFCSmartGatewayService {
    private readonly logger;
    private merchantId;
    private terminalId;
    private encryptionKey;
    private baseUrl;
    constructor();
    private encrypt;
    private decrypt;
    createPayment(orderData: any): Promise<any>;
    verifyPayment(encryptedResponse: string): Promise<any>;
    queryTransaction(orderId: string): Promise<HDFCTransactionResponse>;
    validateMerchantCredentials(): boolean;
    generateChecksum(data: string): string;
}
