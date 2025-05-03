
import React from 'react';
import { Budget } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import { getCategoryById } from '@/config/categories';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useExpense } from '@/context/ExpenseContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Edit2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BudgetListProps {
  budgets: Budget[];
}

const BudgetList = ({ budgets }: BudgetListProps) => {
  const { updateBudget, getCategorySummaries } = useExpense();
  const { toast } = useToast();
  const categorySummaries = getCategorySummaries();

  const getBudgetUsage = (categoryId: string) => {
    const summary = categorySummaries.find(s => s.categoryId === categoryId);
    
    if (!summary) return { amount: 0, percentage: 0 };
    
    return {
      amount: summary.totalAmount,
      percentage: summary.budgetAmount > 0 
        ? (summary.totalAmount / summary.budgetAmount) * 100 
        : 0
    };
  };

  const handleBudgetUpdate = (budget: Budget, newAmount: number) => {
    if (newAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Budget amount must be greater than zero",
        variant: "destructive",
      });
      return;
    }

    const updatedBudget = { ...budget, amount: newAmount };
    updateBudget(updatedBudget);
    
    toast({
      title: "Budget updated",
      description: `Budget for ${getCategoryById(budget.category).name} updated to ₹${newAmount}`,
    });
  };

  const sortedBudgets = [...budgets].sort((a, b) => {
    const aCategory = getCategoryById(a.category);
    const bCategory = getCategoryById(b.category);
    return aCategory.name.localeCompare(bCategory.name);
  });

  return (
    <div className="space-y-6">
      {sortedBudgets.length === 0 ? (
        <div className="text-center py-8 bg-muted/50 rounded-md">
          <p className="text-muted-foreground">No budgets defined</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedBudgets.map(budget => {
            const category = getCategoryById(budget.category);
            const usage = getBudgetUsage(budget.category);
            
            return (
              <div key={budget.id} className="bg-card rounded-lg border p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${category.color}`}>
                      <span>{category.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <Badge variant="outline" className="text-xs capitalize">{budget.period}</Badge>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Budget for {category.name}</DialogTitle>
                        <DialogDescription>
                          Change the budget amount for this category.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="amount" className="text-right">Amount</label>
                          <div className="col-span-3 relative">
                            <span className="absolute left-3 top-2.5">₹</span>
                            <Input
                              id="amount"
                              type="number"
                              className="pl-7"
                              defaultValue={budget.amount}
                              step="0.01"
                              onChange={(e) => {}}
                              onBlur={(e) => handleBudgetUpdate(budget, parseFloat(e.target.value))}
                            />
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <div className="text-xl font-semibold">{formatCurrency(budget.amount)}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(usage.amount)} spent ({usage.percentage.toFixed(1)}%)
                  </div>
                </div>
                
                <Progress 
                  value={Math.min(usage.percentage, 100)} 
                  className="h-2"
                  indicatorClassName={
                    usage.percentage > 90 ? 'bg-destructive' : 
                    usage.percentage > 75 ? 'bg-warning' : 
                    'bg-success'
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetList;
