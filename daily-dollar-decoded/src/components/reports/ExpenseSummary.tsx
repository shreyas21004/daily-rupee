
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import { categories, getCategoryById } from '@/config/categories';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

const ExpenseSummary = ({ expenses }: ExpenseSummaryProps) => {
  // Calculate total spending
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Group expenses by category
  const expensesByCategory = expenses.reduce<Record<string, number>>(
    (acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, 
    {}
  );
  
  // Format category data for display
  const categoryData = Object.entries(expensesByCategory)
    .map(([categoryId, amount]) => ({
      category: getCategoryById(categoryId),
      amount,
      percentage: (amount / totalSpent) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);
    
  // Get merchant with highest spending
  const merchantSpending = expenses.reduce<Record<string, number>>(
    (acc, expense) => {
      const merchant = expense.merchant || 'Unknown';
      if (!acc[merchant]) {
        acc[merchant] = 0;
      }
      acc[merchant] += expense.amount;
      return acc;
    },
    {}
  );
  
  const topMerchants = Object.entries(merchantSpending)
    .map(([merchant, amount]) => ({ merchant, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Total Spending</h3>
            <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Top Categories</h3>
            <div className="space-y-3">
              {categoryData.length === 0 ? (
                <p className="text-muted-foreground">No data available</p>
              ) : (
                categoryData.map(({ category, amount, percentage }) => (
                  <div key={category.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${category.color}`}>
                        <span className="text-sm">{category.icon}</span>
                      </div>
                      <span>{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div>{formatCurrency(amount)}</div>
                      <div className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Top Merchants</h3>
            <div className="space-y-3">
              {topMerchants.length === 0 ? (
                <p className="text-muted-foreground">No data available</p>
              ) : (
                topMerchants.map(({ merchant, amount }) => (
                  <div key={merchant} className="flex justify-between items-center">
                    <div>{merchant}</div>
                    <div>{formatCurrency(amount)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseSummary;
