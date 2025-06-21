export declare enum PrintPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    URGENT = "urgent"
}
export declare enum PrintQuality {
    DRAFT = "draft",
    NORMAL = "normal",
    HIGH = "high",
    BEST = "best"
}
export declare enum PaperType {
    STANDARD = "standard",
    GLOSSY = "glossy",
    MATTE = "matte",
    WATERPROOF = "waterproof",
    ADHESIVE = "adhesive"
}
export declare class CreatePrintJobDto {
    name: string;
    labelIds: number[];
    printerId?: string;
    copies?: number;
    priority?: PrintPriority;
    quality?: PrintQuality;
    paperType?: PaperType;
    printImmediately?: boolean;
    scheduledFor?: Date;
}
