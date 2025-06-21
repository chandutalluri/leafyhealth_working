// Entity definitions are centralized in shared/schema.ts
// This file serves as a reference for accounting-management specific entities

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'asset' | 'liability';
  category?: string;
  reference?: string;
  transactionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: 'office_supplies' | 'utilities' | 'rent' | 'marketing' | 'travel' | 'other';
  vendor?: string;
  receiptNumber?: string;
  expenseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}