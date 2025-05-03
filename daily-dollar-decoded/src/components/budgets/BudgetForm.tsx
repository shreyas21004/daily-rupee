import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useExpense } from '@/context/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { categories } from '@/config/categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  period: z.enum(['monthly', 'weekly', 'yearly']),
});

type BudgetFormValues = z.infer<typeof formSchema>;

interface BudgetFormProps {
  onSuccess?: () => void;
}

const BudgetForm = ({ onSuccess }: BudgetFormProps) => {
  const { addBudget, budgets } = useExpense();
  const { toast } = useToast();
  
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      amount: 0,
      period: 'monthly',
    },
  });

  function onSubmit(values: BudgetFormValues) {
    const existingBudget = budgets.find(budget => budget.category === values.category);
    
    if (existingBudget) {
      toast({
        title: "Budget already exists",
        description: `A budget for this category already exists. Please update the existing one.`,
        variant: "destructive",
      });
      return;
    }
    
    addBudget({
      category: values.category,
      amount: values.amount,
      period: values.period
    });
    
    toast({
      title: "Budget added",
      description: `Budget for ${categories.find(c => c.id === values.category)?.name} set to ₹${values.amount}`,
    });
    
    form.reset({
      category: '',
      amount: 0,
      period: 'monthly',
    });
    
    if (onSuccess) {
      onSuccess();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">₹</span>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    className="pl-7" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Period</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">Add Budget</Button>
      </form>
    </Form>
  );
};

export default BudgetForm;
