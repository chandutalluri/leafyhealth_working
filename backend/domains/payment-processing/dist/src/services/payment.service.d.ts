import { RazorpayService } from './razorpay.service';
import { HDFCSmartGatewayService } from './hdfc-smartgateway.service';
export declare class PaymentService {
    private readonly razorpayService;
    private readonly hdfcService;
    private readonly logger;
    constructor(razorpayService: RazorpayService, hdfcService: HDFCSmartGatewayService);
    createRazorpayPayment(paymentData: any): Promise<{
        success: boolean;
        paymentId: string;
        razorpayOrderId: string;
        amount: any;
        currency: any;
        key: string;
        order: import("./razorpay.service").RazorpayOrder;
        error?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        paymentId?: undefined;
        razorpayOrderId?: undefined;
        amount?: undefined;
        currency?: undefined;
        key?: undefined;
        order?: undefined;
    }>;
    createHDFCPayment(paymentData: any): Promise<{
        success: boolean;
        paymentId: string;
        hdfcOrderId: any;
        redirectUrl: any;
        amount: any;
        currency: any;
        error?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        paymentId?: undefined;
        hdfcOrderId?: undefined;
        redirectUrl?: undefined;
        amount?: undefined;
        currency?: undefined;
    }>;
    verifyRazorpayPayment(verifyDto: any): Promise<{
        success: boolean;
        paymentId: any;
        orderId: any;
        status: string;
        transactionId: string;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        paymentId?: undefined;
        orderId?: undefined;
        status?: undefined;
        transactionId?: undefined;
    }>;
    verifyHDFCPayment(verifyDto: any): Promise<{
        success: boolean;
        paymentId: any;
        status: any;
        transactionId: string;
        amount: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        paymentId?: undefined;
        status?: undefined;
        transactionId?: undefined;
        amount?: undefined;
    }>;
    refundPayment(refundDto: any): Promise<{
        success: boolean;
        refundId: string;
        gatewayRefundId: any;
        amount: any;
        status: string;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        refundId?: undefined;
        gatewayRefundId?: undefined;
        amount?: undefined;
        status?: undefined;
    }>;
    handleWebhook(webhookData: any, gateway: string): Promise<{
        received: boolean;
    }>;
}
