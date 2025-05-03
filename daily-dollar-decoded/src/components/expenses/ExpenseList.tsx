
import React, { useState } from 'react';
import { Expense } from '@/types/expense';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getCategoryById } from '@/config/categories';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useExpense } from '@/context/ExpenseContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ExpenseListProps {
  expenses: Expense[];
}

const ExpenseList = ({ expenses }: ExpenseListProps) => {
  const { deleteExpense } = useExpense();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = searchTerm === '' || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.merchant && expense.merchant.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (expense.notes && expense.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || expense.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort expenses by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (expense: Expense) => {
    deleteExpense(expense.id);
    toast({
      title: "Expense deleted",
      description: `${expense.description} ($${expense.amount})`,
    });
  };

  const uniqueCategories = Array.from(
    new Set(expenses.map(expense => expense.category))
  ).map(categoryId => getCategoryById(categoryId));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          
          {uniqueCategories.map(category => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`cursor-pointer ${selectedCategory === category.id ? category.color : ''}`}
              onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="text-center py-8 bg-muted/50 rounded-md">
          <p className="text-muted-foreground">No expenses found</p>
        </div>
      ) : (
        <div className="divide-y">
          {sortedExpenses.map(expense => {
            const category = getCategoryById(expense.category);
            
            return (
              <div key={expense.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${category.color}`}>
                    <span className="text-lg">{category.icon}</span>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{expense.description}</h3>
                    <div className="text-sm text-muted-foreground">
                      {expense.merchant && <span>{expense.merchant} • </span>}
                      <span>{formatDate(expense.date)}</span>
                    </div>
                    {expense.notes && (
                      <p className="text-sm mt-1">{expense.notes}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 ml-auto">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(expense.amount)}</div>
                    <Badge variant="outline" className="text-xs">{category.name}</Badge>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="sr-only">Delete expense</span>
                        ❌
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Expense</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this expense? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => {}}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDelete(expense)}>Delete</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
