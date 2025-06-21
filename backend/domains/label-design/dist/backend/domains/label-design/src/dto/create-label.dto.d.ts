export declare enum LabelType {
    PRICE_TAG = "price_tag",
    NUTRITION_LABEL = "nutrition_label",
    BARCODE_LABEL = "barcode_label",
    PRODUCT_LABEL = "product_label",
    COMPLIANCE_LABEL = "compliance_label",
    PROMOTIONAL = "promotional",
    SHELF_TALKER = "shelf_talker"
}
export declare enum LabelSize {
    SMALL = "2x1",
    MEDIUM = "4x2",
    LARGE = "4x6",
    CUSTOM = "custom"
}
export declare class CreateLabelDto {
    name: string;
    type: LabelType;
    size: LabelSize;
    productId?: number;
    templateId?: number;
    content?: Record<string, any>;
    language?: string;
    requiresCompliance?: boolean;
}
