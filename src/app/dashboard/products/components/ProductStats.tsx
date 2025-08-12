// app/dashboard/products/components/ProductStats.tsx
'use client'
import { Package, Tag, AlertCircle, DollarSign, Layers } from 'lucide-react';
import { StatCard } from './StatCard';

interface ProductStatsProps {
  stats: {
    totalProducts: number;
    published: number;
    outOfStock: number;
    totalValue: number;
    averagePrice: number;
  };
}

export function ProductStats({ stats }: ProductStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard 
        icon={<Package className="h-5 w-5 text-amber-400" />} 
        title="Total Products" 
        value={stats.totalProducts} 
        trend="up" 
        change="12%" 
      />
      <StatCard 
        icon={<Tag className="h-5 w-5 text-emerald-400" />} 
        title="Published" 
        value={stats.published} 
        percentage={stats.totalProducts > 0 ? Math.round((stats.published / stats.totalProducts) * 100) : 0} 
      />
      <StatCard 
        icon={<AlertCircle className="h-5 w-5 text-red-400" />} 
        title="Out of Stock" 
        value={stats.outOfStock} 
        trend="up" 
        change="5%" 
      />
      <StatCard 
        icon={<DollarSign className="h-5 w-5 text-amber-400" />} 
        title="Total Value" 
        value={`$${stats.totalValue.toLocaleString()}`} 
      />
      <StatCard 
        icon={<Layers className="h-5 w-5 text-purple-400" />} 
        title="Avg. Price" 
        value={`$${stats.averagePrice.toFixed(2)}`} 
        trend="down" 
        change="2%" 
      />
    </div>
  );
}