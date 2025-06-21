export declare enum BarcodeType {
    UPC_A = "upc_a",
    EAN_13 = "ean_13",
    CODE_128 = "code_128",
    QR_CODE = "qr_code",
    DATA_MATRIX = "data_matrix",
    PDF417 = "pdf417"
}
export declare enum BarcodeFormat {
    PNG = "png",
    SVG = "svg",
    PDF = "pdf"
}
export declare class CreateBarcodeDto {
    data: string;
    type: BarcodeType;
    format: BarcodeFormat;
    productId?: number;
    width?: number;
    height?: number;
    displayText?: string;
}
