'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package } from 'lucide-react'
import { Product } from '../types'

export function FeaturedProducts({ products }: { products: Product[] }) {
  const recentProducts = [...products]
    .sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 5)

  const expensiveProducts = [...products]
    .sort((a, b) => 
      (b.salePrice || b.price) - (a.salePrice || a.price)
    )
    .slice(0, 3)

  return (
    <Card className="mb-6 border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-white">Featured Products</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium text-white mb-4">Recently Added</h3>
          <div className="space-y-4">
            {recentProducts.map(product => (
              <div key={`recent-${product.id}`} className="flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
                <div className="flex-shrink-0 relative">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-gray-800 flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.name}</p>
                  <p className="text-sm text-gray-400">${product.price.toFixed(2)}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {new Date(product.createdAt || '').toLocaleDateString()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-white mb-4">Top Premium</h3>
          <div className="space-y-4">
            {expensiveProducts.map(product => (
              <div key={`expensive-${product.id}`} className="flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
                <div className="flex-shrink-0 relative">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-gray-800 flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.name}</p>
                  <p className="text-sm text-gray-400">${(product.salePrice || product.price).toFixed(2)}</p>
                </div>
                <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-400">
                  Premium
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}