export declare enum BudgetPeriod {
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly"
}
export declare enum BudgetStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    INACTIVE = "inactive",
    EXPIRED = "expired"
}
export declare class CreateBudgetDto {
    name: string;
    amount: number;
    period: BudgetPeriod;
    startDate: string;
    endDate: string;
    costCenter?: string;
    categories?: string[];
    description?: string;
    alertThreshold?: number;
    ownerId?: number;
    status?: BudgetStatus;
}
