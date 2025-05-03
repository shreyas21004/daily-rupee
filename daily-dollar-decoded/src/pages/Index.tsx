
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useExpense } from '@/context/ExpenseContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import RecentExpenses from '@/components/dashboard/RecentExpenses';
import Layout from '@/components/layout/Layout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ExpenseForm from '@/components/expenses/ExpenseForm';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { expenses, getDashboardSummary, getCategorySummaries } = useExpense();

  React.useEffect(() => {
    // For demo, skip the authentication check
    // if (!isAuthenticated) {
    //   navigate('/login');
    // }
  }, [isAuthenticated, navigate]);

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Expense</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Enter the details of your expense below.
                </DialogDescription>
              </DialogHeader>
              <ExpenseForm />
            </DialogContent>
          </Dialog>
        </div>

        <DashboardHeader summary={getDashboardSummary()} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CategoryBreakdown categorySummaries={getCategorySummaries()} />
          <RecentExpenses expenses={expenses} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
