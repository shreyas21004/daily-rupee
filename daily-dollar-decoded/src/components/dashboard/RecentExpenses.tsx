
import React from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Expense } from '@/types/expense';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategoryById } from '@/config/categories';
import { Badge } from '@/components/ui/badge';

interface RecentExpensesProps {
  expenses: Expense[];
}

const RecentExpenses = ({ expenses }: RecentExpensesProps) => {
  const recentExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {recentExpenses.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No expenses to display</p>
        ) : (
          <div className="space-y-4">
            {recentExpenses.map(expense => {
              const category = getCategoryById(expense.category);
              
              return (
                <div key={expense.id} className="flex items-center justify-between p-2 hover:bg-secondary rounded-md transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
                      <span className="text-lg">{category.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{expense.description}</h4>
                      <p className="text-sm text-muted-foreground">
                        {expense.merchant && `${expense.merchant} • `}
                        {formatDate(expense.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium">{formatCurrency(expense.amount)}</span>
                    <Badge variant="outline" className="text-xs">{category.name}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentExpenses;
