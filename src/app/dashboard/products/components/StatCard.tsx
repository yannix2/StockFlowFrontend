// app/dashboard/products/components/StatCard.tsx
'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  percentage?: number;
  trend?: 'up' | 'down';
  change?: string;
}

export function StatCard({ icon, title, value, percentage, trend, change }: StatCardProps) {
  return (
    <Card className="border border-gray-800 bg-gray-900/50 hover:bg-gray-900/70 transition-colors hover:shadow-lg hover:shadow-amber-500/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xs font-medium text-gray-400">
          {title}
        </CardTitle>
        <div className="h-7 w-7 rounded-full bg-gray-800 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {percentage !== undefined ? (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium text-amber-400">{percentage}%</span>
            </div>
            <Progress 
              value={percentage} 
              className="h-1.5 mt-1 bg-gray-800" 
              indicatorClassName="bg-gradient-to-r from-amber-500 to-yellow-500"
            />
          </div>
        ) : change && trend ? (
          <div className="flex items-center gap-1 mt-1">
            {trend === 'up' ? (
              <span className="text-xs text-green-400">↑ {change}</span>
            ) : (
              <span className="text-xs text-red-400">↓ {change}</span>
            )}
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}