
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { DashboardSummary } from '@/types/expense';

interface DashboardHeaderProps {
  summary: DashboardSummary;
}

const DashboardHeader = ({ summary }: DashboardHeaderProps) => {
  const { totalSpent, budgetTotal, remaining, percentUsed } = summary;

  return (
    <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
      <h1 className="text-2xl font-bold mb-4">Monthly Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-secondary rounded-md p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
          <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
        </div>
        
        <div className="bg-secondary rounded-md p-4">
          <p className="text-sm text-muted-foreground mb-1">Monthly Budget</p>
          <p className="text-2xl font-bold">{formatCurrency(budgetTotal)}</p>
        </div>
        
        <div className="bg-secondary rounded-md p-4">
          <p className="text-sm text-muted-foreground mb-1">Remaining</p>
          <p className={`text-2xl font-bold ${remaining < 0 ? 'text-destructive' : 'text-success'}`}>
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Budget Used</span>
          <span className="text-sm font-medium">{percentUsed.toFixed(1)}%</span>
        </div>
        <Progress 
          value={percentUsed} 
          className="h-2" 
          indicatorClassName={percentUsed > 90 ? 'bg-destructive' : percentUsed > 75 ? 'bg-warning' : 'bg-success'} 
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
