
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import { categories } from '@/config/categories';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface SpendingTrendsProps {
  expenses: Expense[];
}

const SpendingTrends = ({ expenses }: SpendingTrendsProps) => {
  // Group expenses by date, then by category
  const expensesByDate = expenses.reduce<Record<string, Record<string, number>>>(
    (acc, expense) => {
      const date = expense.date.substring(0, 7); // YYYY-MM format
      if (!acc[date]) {
        acc[date] = {};
      }
      
      if (!acc[date][expense.category]) {
        acc[date][expense.category] = 0;
      }
      
      acc[date][expense.category] += expense.amount;
      return acc;
    }, 
    {}
  );

  // Create data for chart
  const chartData = Object.entries(expensesByDate)
    .map(([date, categories]) => {
      const [year, month] = date.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[parseInt(month, 10) - 1];
      
      return {
        name: `${monthName} ${year}`,
        ...categories,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Get color values for chart
  const getChartColor = (id: string) => {
    const colorMap: Record<string, string> = {
      'food': '#ef4444',
      'transport': '#3b82f6',
      'utilities': '#eab308',
      'entertainment': '#a855f7',
      'shopping': '#ec4899',
      'health': '#22c55e',
      'other': '#6b7280',
    };
    
    return colorMap[id] || '#6b7280';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] mt-4">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Not enough data to display trends</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `$${value}`} 
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px' }}
                />
                <Legend />
                {categories.map(category => (
                  <Bar 
                    key={category.id}
                    dataKey={category.id}
                    name={category.name}
                    fill={getChartColor(category.id)}
                    stackId="a"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingTrends;
