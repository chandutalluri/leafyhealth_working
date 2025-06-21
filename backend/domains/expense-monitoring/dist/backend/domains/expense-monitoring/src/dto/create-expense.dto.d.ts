export declare enum ExpenseCategory {
    OFFICE_SUPPLIES = "office_supplies",
    TRAVEL = "travel",
    MARKETING = "marketing",
    SOFTWARE = "software",
    UTILITIES = "utilities",
    RENT = "rent",
    MEALS = "meals",
    EQUIPMENT = "equipment",
    PROFESSIONAL_SERVICES = "professional_services",
    TRAINING = "training",
    OTHER = "other"
}
export declare enum ExpenseStatus {
    DRAFT = "draft",
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    PAID = "paid"
}
export declare class CreateExpenseDto {
    title: string;
    amount: number;
    category: ExpenseCategory;
    expenseDate: string;
    vendor?: string;
    costCenter?: string;
    projectCode?: string;
    receiptUrl?: string;
    notes?: string;
    employeeId?: number;
    status?: ExpenseStatus;
}
