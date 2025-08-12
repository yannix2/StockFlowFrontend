'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Trash2, Edit, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  stockFilter: string;
  setStockFilter: (filter: string) => void;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onFilterChange: () => void;
}

export function ProductTable({
  products,
  isLoading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  stockFilter,
  setStockFilter,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  onEditProduct,
  onDeleteProduct,
  onFilterChange,
}: ProductTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'publish':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{status}</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>;
      case 'pending':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{status}</Badge>;
      case 'private':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStockBadge = (stockStatus: string, stockQuantity?: number) => {
    const actualStatus = stockQuantity !== undefined && stockQuantity <= 0 ? 'outofstock' : stockStatus;
    
    switch (actualStatus) {
      case 'instock':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">In Stock</Badge>;
      case 'outofstock':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Out of Stock</Badge>;
      case 'onbackorder':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Backorder</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-xl hover:shadow-amber-500/10 transition-shadow">
      <CardHeader className="border-b border-gray-800 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Product Inventory</CardTitle>
            <CardDescription className="text-gray-400">
              {isLoading ? 'Loading...' : `${products.length} products found`}
            </CardDescription>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus-visible:ring-amber-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onFilterChange()}
              />
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="md:hidden flex items-center gap-2 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
              size="sm"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>
        
        {/* Filters Section - Always visible on desktop */}
        <div className="hidden md:flex flex-col md:flex-row gap-3 pt-4">
          <div className="flex-1 min-w-[200px]">
            <Select 
              value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value);
                onFilterChange();
              }}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="publish">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <Select 
              value={stockFilter} 
              onValueChange={(value) => {
                setStockFilter(value);
                onFilterChange();
              }}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by stock" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="instock">In Stock</SelectItem>
                <SelectItem value="outofstock">Out of Stock</SelectItem>
                <SelectItem value="onbackorder">On Backorder</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={onFilterChange}
            className="bg-amber-500 hover:bg-amber-600 text-white"
            size="sm"
          >
            Apply Filters
          </Button>
        </div>

        {/* Mobile Filters Section */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="publish">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Stock" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="instock">In Stock</SelectItem>
                    <SelectItem value="outofstock">Out of Stock</SelectItem>
                    <SelectItem value="onbackorder">On Backorder</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={onFilterChange}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  size="sm"
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full"
            />
          </div>
        ) : 
        products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <Package className="mx-auto h-10 w-10 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-300">No products found</h3>
            <p className="text-gray-400 mt-1">Try adjusting your search or filters</p>
            <Button
              variant="ghost"
              className="mt-3 text-amber-400 hover:bg-amber-500/10"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setStockFilter('all');
                onFilterChange();
              }}
              size="sm"
            >
              Reset filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader className="bg-gray-800">
                  <TableRow className="hover:bg-gray-800">
                    <TableHead className="w-[100px]">SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {products.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-gray-800 hover:bg-gray-800/50"
                      >
                        <TableCell className="font-medium">{product.sku}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-gray-700 flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-gray-700 text-gray-300">
                            {product.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col">
                            <span className="font-bold text-amber-400">
                              ${product.price?.toFixed(2) || '0.00'}
                            </span>
                            {product.salePrice && product.salePrice > 0 && (
                              <span className="text-sm line-through text-gray-400">
                                ${product.regularPrice?.toFixed(2) || product.price?.toFixed(2) || '0.00'}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {getStockBadge(product.stockStatus, product.stockQuantity)}
                            {product.manageStock && (
                              <span className="text-sm text-gray-400">({product.stockQuantity})</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(product.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-amber-400 hover:bg-amber-500/10"
                              onClick={() => onEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:bg-red-500/10"
                              onClick={() => onDeleteProduct(product)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-2 p-3">
              <AnimatePresence>
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-gray-700 flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-400">{product.sku}</p>
                          </div>
                        </div>
                        {getStatusBadge(product.status)}
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-400">Type</p>
                          <Badge variant="outline" className="border-gray-700 text-gray-300">
                            {product.type}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Price</p>
                          <div className="flex flex-col">
                            <span className="font-bold text-amber-400">
                              ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                            </span>
                            {product.salePrice && (
                              <span className="text-sm line-through text-gray-400">
                                ${typeof product.regularPrice === 'number' ? product.regularPrice.toFixed(2) : '0.00'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Stock</p>
                          <div className="flex items-center gap-2">
                            {getStockBadge(product.stockStatus, product.stockQuantity)}
                            {product.manageStock && (
                              <span className="text-sm text-gray-400">({product.stockQuantity})</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-400 hover:bg-amber-500/10"
                          onClick={() => onEditProduct(product)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:bg-red-500/10"
                          onClick={() => onDeleteProduct(product)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}