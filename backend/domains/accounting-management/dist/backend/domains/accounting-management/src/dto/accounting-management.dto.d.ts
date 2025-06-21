export declare enum TransactionType {
    INCOME = "income",
    EXPENSE = "expense",
    ASSET = "asset",
    LIABILITY = "liability"
}
export declare enum ExpenseCategory {
    OFFICE_SUPPLIES = "office_supplies",
    UTILITIES = "utilities",
    RENT = "rent",
    MARKETING = "marketing",
    TRAVEL = "travel",
    OTHER = "other"
}
export declare class CreateTransactionDto {
    description: string;
    amount: number;
    type: TransactionType;
    category?: string;
    reference?: string;
    transactionDate?: string;
}
declare const UpdateTransactionDto_base: import("@nestjs/common").Type<Partial<CreateTransactionDto>>;
export declare class UpdateTransactionDto extends UpdateTransactionDto_base {
}
export declare class CreateExpenseDto {
    description: string;
    amount: number;
    category: ExpenseCategory;
    vendor?: string;
    receiptNumber?: string;
    expenseDate?: string;
}
declare const UpdateExpenseDto_base: import("@nestjs/common").Type<Partial<CreateExpenseDto>>;
export declare class UpdateExpenseDto extends UpdateExpenseDto_base {
}
export {};
