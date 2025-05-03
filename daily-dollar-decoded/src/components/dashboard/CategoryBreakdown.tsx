
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { CategorySummary } from '@/types/expense';
import { getCategoryById } from '@/config/categories';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryBreakdownProps {
  categorySummaries: CategorySummary[];
}

const CategoryBreakdown = ({ categorySummaries }: CategoryBreakdownProps) => {
  // Filter out categories with 0 spending for the chart
  const chartData = categorySummaries
    .filter(summary => summary.totalAmount > 0)
    .map(summary => ({
      name: getCategoryById(summary.categoryId).name,
      value: summary.totalAmount,
      id: summary.categoryId,
      color: getCategoryById(summary.categoryId).color.replace('bg-', ''),
    }));

  // Get color values for chart
  const getChartColor = (id: string) => {
    const colorMap: Record<string, string> = {
      'red-500': '#ef4444',
      'blue-500': '#3b82f6',
      'yellow-500': '#eab308',
      'purple-500': '#a855f7',
      'pink-500': '#ec4899',
      'green-500': '#22c55e',
      'gray-500': '#6b7280',
    };
    
    const category = getCategoryById(id);
    const colorClass = category.color.replace('bg-', '');
    return colorMap[colorClass] || '#6b7280';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.id} fill={getChartColor(entry.id)} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4 mt-6">
          {categorySummaries
            .filter(summary => summary.budgetAmount > 0)
            .map(summary => {
              const category = getCategoryById(summary.categoryId);
              const percentage = summary.budgetAmount > 0 
                ? (summary.totalAmount / summary.budgetAmount) * 100 
                : 0;
              
              return (
                <div key={summary.categoryId} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-4 h-4 rounded-full ${category.color}`}></span>
                      <span>{category.name}</span>
                    </div>
                    <div className="text-sm">
                      {formatCurrency(summary.totalAmount)} of {formatCurrency(summary.budgetAmount)}
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                    indicatorClassName={percentage > 90 ? 'bg-destructive' : percentage > 75 ? 'bg-warning' : 'bg-success'}
                  />
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdown;
