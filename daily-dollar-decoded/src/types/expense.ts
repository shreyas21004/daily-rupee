
export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  merchant?: string;
  notes?: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

export interface DashboardSummary {
  totalSpent: number;
  budgetTotal: number;
  remaining: number;
  percentUsed: number;
}

export interface CategorySummary {
  categoryId: string;
  totalAmount: number;
  budgetAmount: number;
  percentage: number;
}
