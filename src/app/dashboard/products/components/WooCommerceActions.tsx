// app/dashboard/products/components/WooCommerceActions.tsx
'use client'
import { Button } from '@/components/ui/button';
import { Download, Upload, RefreshCw } from 'lucide-react';

interface WooCommerceActionsProps {
  isLoading: {
    import: boolean;
    export: boolean;
    sync: boolean;
  };
  onAction: (action: 'import' | 'export' | 'sync') => void;
}

export function WooCommerceActions({ isLoading, onAction }: WooCommerceActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        onClick={() => onAction('import')}
        disabled={isLoading.import}
        variant="outline"
        className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300"
        size="sm"
      >
        {isLoading.import ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Import
      </Button>
      <Button
        onClick={() => onAction('export')}
        disabled={isLoading.export}
        variant="outline"
        className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300"
        size="sm"
      >
        {isLoading.export ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        Export
      </Button>
      <Button
        onClick={() => onAction('sync')}
        disabled={isLoading.sync}
        variant="outline"
        className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300"
        size="sm"
      >
        {isLoading.sync ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-4 w-4" />
        )}
        Sync
      </Button>
    </div>
  );
}