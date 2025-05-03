
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, Budget, DashboardSummary, CategorySummary } from '@/types/expense';
import { generateId } from '@/lib/utils';
import { categories } from '@/config/categories';

// Sample data for demo
const initialExpenses: Expense[] = [
  {
    id: '1',
    amount: 42.75,
    description: 'Grocery shopping',
    category: 'food',
    date: '2025-04-19',
    merchant: 'Whole Foods',
  },
  {
    id: '2',
    amount: 35.50,
    description: 'Gas',
    category: 'transport',
    date: '2025-04-18',
    merchant: 'Shell',
  },
  {
    id: '3',
    amount: 89.99,
    description: 'Electricity bill',
    category: 'utilities',
    date: '2025-04-15',
    merchant: 'Power Company',
  },
  {
    id: '4',
    amount: 12.99,
    description: 'Netflix subscription',
    category: 'entertainment',
    date: '2025-04-10',
    merchant: 'Netflix',
  },
  {
    id: '5',
    amount: 65.43,
    description: 'New shirt',
    category: 'shopping',
    date: '2025-04-08',
    merchant: 'H&M',
  },
];

const initialBudgets: Budget[] = [
  { id: '1', category: 'food', amount: 500, period: 'monthly' },
  { id: '2', category: 'transport', amount: 200, period: 'monthly' },
  { id: '3', category: 'utilities', amount: 300, period: 'monthly' },
  { id: '4', category: 'entertainment', amount: 150, period: 'monthly' },
  { id: '5', category: 'shopping', amount: 200, period: 'monthly' },
  { id: '6', category: 'health', amount: 100, period: 'monthly' },
  { id: '7', category: 'other', amount: 100, period: 'monthly' },
];

interface ExpenseContextType {
  expenses: Expense[];
  budgets: Budget[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  getDashboardSummary: () => DashboardSummary;
  getCategorySummaries: () => CategorySummary[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: generateId() };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (expense: Expense) => {
    setExpenses(prev => prev.map(exp => (exp.id === expense.id ? expense : exp)));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = { ...budget, id: generateId() };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (budget: Budget) => {
    setBudgets(prev => prev.map(b => (b.id === budget.id ? budget : b)));
  };

  const getDashboardSummary = (): DashboardSummary => {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budgetTotal = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const remaining = budgetTotal - totalSpent;
    const percentUsed = budgetTotal > 0 ? (totalSpent / budgetTotal) * 100 : 0;

    return {
      totalSpent,
      budgetTotal,
      remaining,
      percentUsed: Math.min(percentUsed, 100), // Cap at 100%
    };
  };

  const getCategorySummaries = (): CategorySummary[] => {
    return categories.map(category => {
      const totalAmount = expenses
        .filter(expense => expense.category === category.id)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      const budget = budgets.find(b => b.category === category.id);
      const budgetAmount = budget ? budget.amount : 0;
      
      return {
        categoryId: category.id,
        totalAmount,
        budgetAmount,
        percentage: budgetAmount > 0 ? (totalAmount / budgetAmount) * 100 : 0,
      };
    });
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budgets,
        addExpense,
        updateExpense,
        deleteExpense,
        addBudget,
        updateBudget,
        getDashboardSummary,
        getCategorySummaries,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
