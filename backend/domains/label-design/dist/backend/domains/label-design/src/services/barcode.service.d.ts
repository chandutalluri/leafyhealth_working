import { CreateBarcodeDto, BarcodeType } from '../dto/create-barcode.dto';
export declare class BarcodeService {
    generateBarcode(createBarcodeDto: CreateBarcodeDto): Promise<{
        id: number;
        data: string;
        type: BarcodeType;
        format: import("../dto/create-barcode.dto").BarcodeFormat;
        productId: number;
        width: number;
        height: number;
        displayText: string;
        fileUrl: string;
        createdAt: string;
        isValid: boolean;
    }>;
    getBarcodes(filters: {
        type?: BarcodeType;
        productId?: number;
    }): Promise<({
        id: number;
        data: string;
        type: BarcodeType;
        format: string;
        productId: number;
        width: number;
        height: number;
        displayText: string;
        fileUrl: string;
        createdAt: string;
        isValid: boolean;
    } | {
        id: number;
        data: string;
        type: BarcodeType;
        format: string;
        productId: number;
        width: number;
        height: number;
        fileUrl: string;
        createdAt: string;
        isValid: boolean;
        displayText?: undefined;
    })[]>;
    getBarcodeById(id: number): Promise<{
        id: number;
        data: string;
        type: BarcodeType;
        format: string;
        productId: number;
        width: number;
        height: number;
        displayText: string;
        fileUrl: string;
        createdAt: string;
        isValid: boolean;
        metadata: {
            checkDigit: string;
            countryCode: string;
            manufacturerCode: string;
            productCode: string;
        };
    }>;
    downloadBarcode(id: number): Promise<{
        barcodeId: number;
        downloadUrl: string;
        contentType: string;
        filename: string;
        size: number;
        expiresAt: string;
    }>;
    getBarcodeStats(): Promise<{
        totalBarcodes: number;
        byType: {
            upc_a: number;
            ean_13: number;
            code_128: number;
            qr_code: number;
            data_matrix: number;
            pdf417: number;
        };
        byFormat: {
            png: number;
            svg: number;
            pdf: number;
        };
        recentActivity: {
            generatedToday: number;
            downloadedToday: number;
            mostUsedType: string;
        };
        validation: {
            validBarcodes: number;
            invalidBarcodes: number;
            validationRate: number;
        };
    }>;
    private getDefaultWidth;
    private getDefaultHeight;
    private validateBarcodeData;
}
