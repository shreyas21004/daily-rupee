
import React from 'react';
import { useExpense } from '@/context/ExpenseContext';
import Layout from '@/components/layout/Layout';
import SpendingTrends from '@/components/reports/SpendingTrends';
import ExpenseSummary from '@/components/reports/ExpenseSummary';

const Reports = () => {
  const { expenses } = useExpense();

  return (
    <Layout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">
            View and analyze your spending patterns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ExpenseSummary expenses={expenses} />
          <SpendingTrends expenses={expenses} />
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
