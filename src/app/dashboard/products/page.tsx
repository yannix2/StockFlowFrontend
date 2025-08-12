'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from '@/components/ui/sonner'
import { motion } from 'framer-motion'
import { PlusCircle, Trash2, Search, Filter, X, Package, ChevronDown, ChevronUp } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductStats, WooCommerceActions, ProductForm } from './components'
import { FeaturedProducts } from '../products/components/ProductFeaturesComponents'
import { Product, ProductStats as Stats } from './types'
import env from './config';

const FloatingBubbles = () => {
  // Pre-calculate bubble positions and sizes for better performance
  const bubbles = Array.from({ length: 10 }, (_, i) => {
    const size = Math.random() * 150 + 50; // 50-200px
    return {
      id: i,
      size,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      moveX: Math.random() * 80 - 40, // -40 to 40
      moveY: Math.random() * 80 - 40,
      duration: Math.random() * 15 + 15, // 15-30 seconds
      opacity: Math.random() * 0.2 + 0.05, // 0.05-0.25
      delay: Math.random() * 5
    };
  });

  return (
    <div className=" inset-0.5 overflow-hidden pointer-events-none -z-10">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-yellow-400  to-yellow-500"
          initial={{
            x: `${bubble.initialX}vw`,
            y: `${bubble.initialY}vh`,
            opacity: bubble.opacity
          }}
          animate={{
            x: [
              `${bubble.initialX}vw`, 
              `${bubble.initialX + bubble.moveX}vw`,
              `${bubble.initialX}vw`
            ],
            y: [
              `${bubble.initialY}vh`,
              `${bubble.initialY + bubble.moveY}vh`,
              `${bubble.initialY}vh`
            ],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: bubble.delay
          }}
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            filter: "blur(40px)",
          }}
        />
      ))}
    </div>
  );
};
export default function ProductManagement() {
  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('')
  const [skuFilter, setSkuFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number | undefined, number | undefined]>([undefined, undefined])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null)

  const [isWooActionLoading, setIsWooActionLoading] = useState({
    import: false,
    export: false,
    sync: false
  })

  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    published: 0,
    outOfStock: 0,
    totalValue: 0,
    averagePrice: 0
  })

  // Fetch products with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts()
    }, 500)

    return () => {
      clearTimeout(debounceTimer)
    }
  }, [searchTerm, skuFilter, statusFilter, stockFilter, priceRange])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      
      const params = new URLSearchParams()
      if (searchTerm) params.append('name', searchTerm)
      if (skuFilter) params.append('sku', skuFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (stockFilter !== 'all') params.append('stockStatus', stockFilter)
      if (priceRange[0] !== undefined) params.append('priceMin', priceRange[0].toString())
      if (priceRange[1] !== undefined) params.append('priceMax', priceRange[1].toString())

      const apiUrl = `https://stockflowbackend-2j27.onrender.com/products/filter?${params.toString()}`
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      const processedProducts = data.map((product: any) => ({
        ...product,
        price: Number(product.price) || 0,
        regularPrice: product.regularPrice ? Number(product.regularPrice) : undefined,
        salePrice: product.salePrice ? Number(product.salePrice) : undefined,
      }))

      setProducts(processedProducts)
      calculateStats(processedProducts)
    } catch (error) {
      toast.error('Failed to load products', {
        description: 'Please try again later'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (products: Product[]) => {
    const totalProducts = products.length
    const published = products.filter(p => p.status === 'publish').length
    const outOfStock = products.filter(p => 
      p.stockStatus === 'outofstock' || (p.stockQuantity !== undefined && p.stockQuantity <= 0)
    ).length
    
    const totalValue = products.reduce((sum, product) => sum + product.price, 0)
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0

    setStats({
      totalProducts,
      published,
      outOfStock,
      totalValue,
      averagePrice,
    })
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSkuFilter('')
    setStatusFilter('all')
    setStockFilter('all')
    setPriceRange([undefined, undefined])
  }

  const handlePriceChange = (index: number, value: string) => {
    const newPriceRange = [...priceRange] as [number | undefined, number | undefined]
    newPriceRange[index] = value ? Number(value) : undefined
    setPriceRange(newPriceRange)
  }

  const handleSaveProduct = async (values: any) => {
    setIsSubmitting(true)
    try {
      const isUpdate = !!currentProduct
      const url = isUpdate
        ? `https://stockflowbackend-2j27.onrender.com/products/${currentProduct?.id}`
        : 'https://stockflowbackend-2j27.onrender.com/products'

      const method = isUpdate ? 'PUT' : 'POST'

      const requestBody = {
        ...values,
        price: Number(values.price),
        regularPrice: values.regularPrice ? Number(values.regularPrice) : null,
        salePrice: values.salePrice ? Number(values.salePrice) : null,
        stockQuantity: values.stockQuantity ? Number(values.stockQuantity) : 0,
        weight: values.weight ? Number(values.weight) : null,
        dimensions: {
          length: values.dimensions?.length ? Number(values.dimensions.length) : null,
          width: values.dimensions?.width ? Number(values.dimensions.width) : null,
          height: values.dimensions?.height ? Number(values.dimensions.height) : null,
        }
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to ${isUpdate ? 'update' : 'create'} product`)
      }

      const result = await response.json()
      
      toast.success(
        isUpdate ? 'Product updated successfully' : 'Product created successfully',
        { description: `SKU: ${result.sku}` }
      )
      
      setIsFormOpen(false)
      setCurrentProduct(null)
      await fetchProducts()
    } catch (error) {
      toast.error(`Failed to ${currentProduct ? 'update' : 'create'} product`, {
        description: error instanceof Error ? error.message : 'Please check your data'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleProductExpand = (id: number) => {
    setExpandedProductId(expandedProductId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingBubbles />
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <motion.h1 
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Product Management
              </motion.h1>
              <p className="text-gray-400">Manage your product catalog with ease</p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => {
                  setCurrentProduct(null)
                  setIsFormOpen(true)
                }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium shadow-lg hover:shadow-yellow-500/30 transition-all group"
              >
                <PlusCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                Add Product
              </Button>
            </motion.div>
          </div>
          
          <ProductStats stats={stats} />
          <WooCommerceActions 
            isLoading={isWooActionLoading} 
            onAction={async (action) => {
              setIsWooActionLoading(prev => ({ ...prev, [action]: true }))
              try {
                const response = await fetch(`https://stockflowbackend-2j27.onrender.com/woocommerce/${action}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })

                if (!response.ok) {
                  throw new Error(`Failed to ${action} from WooCommerce`)
                }

                const result = await response.json()
                toast.success(result.message || `WooCommerce ${action} completed successfully`)
                await fetchProducts()
              } catch (error) {
                toast.error(`Failed to ${action} from WooCommerce`)
                console.error(error)
              } finally {
                setIsWooActionLoading(prev => ({ ...prev, [action]: false }))
              }
            }} 
          />
        </motion.div>

        {/* Featured Products Section */}
        <FeaturedProducts products={products} />

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6 border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg text-white">Product Inventory</CardTitle>
                  <p className="text-sm text-gray-400">
                    {isLoading ? 'Loading...' : `${products.length} products found`}
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name..."
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-1 focus:ring-yellow-500/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by SKU..."
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-1 focus:ring-yellow-500/50"
                      value={skuFilter}
                      onChange={(e) => setSkuFilter(e.target.value)}
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
              
              {/* Desktop Filters */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-3 pt-4">
                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600">
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
                
                <Select 
                  value={stockFilter} 
                  onValueChange={(value) => setStockFilter(value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600">
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="instock">In Stock</SelectItem>
                    <SelectItem value="outofstock">Out of Stock</SelectItem>
                    <SelectItem value="onbackorder">On Backorder</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min price"
                    className="bg-gray-800 border-gray-700 text-white focus:ring-1 focus:ring-yellow-500/50"
                    value={priceRange[0] ?? ''}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max price"
                    className="bg-gray-800 border-gray-700 text-white focus:ring-1 focus:ring-yellow-500/50"
                    value={priceRange[1] ?? ''}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                  />
                </div>
                
                <Button 
                  variant="ghost"
                  onClick={resetFilters}
                  className="text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </div>

              {/* Mobile Filters */}
              <div className={`md:hidden ${mobileFiltersOpen ? 'block' : 'hidden'} space-y-3 pt-4`}>
                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value)}
                >
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
                
                <Select 
                  value={stockFilter} 
                  onValueChange={(value) => setStockFilter(value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="instock">In Stock</SelectItem>
                    <SelectItem value="outofstock">Out of Stock</SelectItem>
                    <SelectItem value="onbackorder">On Backorder</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min price"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={priceRange[0] ?? ''}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max price"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={priceRange[1] ?? ''}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                  />
                </div>
                
                <Button 
                  variant="ghost"
                  onClick={resetFilters}
                  className="text-gray-400 hover:bg-gray-800 hover:text-white w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Product Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-4 p-6">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg bg-gray-800" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div 
                    className="mx-auto h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mb-4"
                    animate={{ 
                      rotate: 360,
                      transition: { 
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                      }
                    }}
                  >
                    <Search className="h-6 w-6 text-gray-400" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-white">No products found</h3>
                  <p className="text-gray-400 mt-1">
                    {searchTerm || skuFilter || statusFilter !== 'all' || stockFilter !== 'all' || priceRange.some(Boolean)
                      ? 'Try adjusting your search or filters'
                      : 'Create your first product to get started'}
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-4 text-yellow-400 hover:bg-yellow-500/10"
                    onClick={resetFilters}
                    size="sm"
                  >
                    Reset filters
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800 border-b border-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {products.map((product) => (
                        <motion.tr 
                          key={product.id} 
                          className="hover:bg-gray-800/50"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td 
                            className="px-6 py-4 whitespace-nowrap cursor-pointer"
                            onClick={() => toggleProductExpand(product.id)}
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-700 flex items-center justify-center overflow-hidden">
                                {product.images?.[0] ? (
                                  <img 
                                    className="h-10 w-10 rounded-md object-cover transition-transform hover:scale-105" 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-md bg-gray-700 flex items-center justify-center">
                                    <Package className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{product.name}</div>
                                <div className="text-xs text-gray-400">{product.type}</div>
                              </div>
                            </div>
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 cursor-pointer"
                            onClick={() => toggleProductExpand(product.id)}
                          >
                            {product.sku}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap cursor-pointer"
                            onClick={() => toggleProductExpand(product.id)}
                          >
                            {product.status === 'publish' ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Published</Badge>
                            ) : product.status === 'draft' ? (
                              <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Draft</Badge>
                            ) : (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{product.status}</Badge>
                            )}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap cursor-pointer"
                            onClick={() => toggleProductExpand(product.id)}
                          >
                            {product.stockStatus === 'instock' ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">In Stock</Badge>
                            ) : product.stockStatus === 'outofstock' ? (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Out of Stock</Badge>
                            ) : (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Backorder</Badge>
                            )}
                            {product.manageStock && (
                              <span className="ml-2 text-xs text-gray-400">({product.stockQuantity})</span>
                            )}
                          </td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm text-white cursor-pointer"
                            onClick={() => toggleProductExpand(product.id)}
                          >
                            ${product.price.toFixed(2)}
                            {product.salePrice && (
                              <span className="ml-2 text-xs line-through text-gray-400">
                                ${product.regularPrice?.toFixed(2) || product.price.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setCurrentProduct(product)
                                  setIsFormOpen(true)
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-400 hover:bg-red-500/10 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setCurrentProduct(product)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:bg-gray-500/10 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleProductExpand(product.id)
                                }}
                              >
                                {expandedProductId === product.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Product Form Dialog */}
        <ProductForm
          isOpen={isFormOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsFormOpen(false)
              setCurrentProduct(null)
            } else {
              setIsFormOpen(true)
            }
          }}
          currentProduct={currentProduct}
          onSave={handleSaveProduct}
          isSubmitting={isSubmitting}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-gray-900 border border-red-500/30">
            <DialogHeader>
              <DialogTitle className="text-red-400">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!currentProduct) return
                  
                  setIsSubmitting(true)
                  try {
                    const response = await fetch(`https://stockflowbackend-2j27.onrender.com/products/${currentProduct.id}`, {
                      method: 'DELETE',
                    })

                    if (!response.ok) {
                      throw new Error('Failed to delete product')
                    }

                    toast.success('Product deleted successfully')
                    setIsDeleteDialogOpen(false)
                    await fetchProducts()
                  } catch (error) {
                    console.error('Error deleting product:', error)
                    toast.error('Failed to delete product')
                  } finally {
                    setIsSubmitting(false)
                    setCurrentProduct(null)
                  }
                }}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-red-500/20 transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Delete Product'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster position="top-right" theme="dark" richColors />
      </div>
    </div>
  )
}