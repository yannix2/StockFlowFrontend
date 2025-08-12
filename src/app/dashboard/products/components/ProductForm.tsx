'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { ProductFormValues, productSchema } from '../schemas'
import { Product } from '../types'
import { useEffect } from 'react'
import { toast } from '@/components/ui/sonner'

interface ProductFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentProduct: Product | null
  onSave: (values: ProductFormValues) => Promise<void>
  isSubmitting: boolean
}

export function ProductForm({
  isOpen,
  onOpenChange,
  currentProduct,
  onSave,
  isSubmitting,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      price: 0,
      regularPrice: undefined,
      salePrice: undefined,
      type: 'simple',
      status: 'publish',
      stockQuantity: 0,
      stockStatus: 'instock',
      manageStock: false,
      weight: undefined,
      dimensions: { length: undefined, width: undefined, height: undefined },
      categories: [],
      tags: [],
      images: [],
      attributes: {},
      variations: [],
      purchaseNote: '',
      soldIndividually: false,
    },
  })

  useEffect(() => {
    if (isOpen && currentProduct) {
      form.reset({
        ...currentProduct,
        regularPrice: currentProduct.regularPrice || undefined,
        salePrice: currentProduct.salePrice || undefined,
        weight: currentProduct.weight || undefined,
        dimensions: {
          length: currentProduct.dimensions?.length ?? undefined,
          width: currentProduct.dimensions?.width ?? undefined,
          height: currentProduct.dimensions?.height ?? undefined,
        },
        purchaseNote: currentProduct.purchaseNote || '',
      })
    } else if (!isOpen) {
      form.reset()
    }
  }, [isOpen, currentProduct, form])

  const onSubmit = async (values: ProductFormValues) => {
    try {
      await onSave(values)
      form.reset() // Reset form after successful submission
    } catch (error) {
      toast.error('Failed to save product', {
        description: error instanceof Error ? error.message : 'Please try again',
      })
    }
  }

  // Utility to handle number input value safely
  const safeNumberValue = (value: number | undefined) =>
    value === undefined || isNaN(value) ? '' : value

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-gray-900 border border-gray-800 max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="border-b border-gray-800 pb-4">
            <DialogTitle className="text-amber-400">
              {currentProduct ? 'Edit Product' : 'Create New Product'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {currentProduct
                ? 'Update the product details below'
                : 'Fill out the form to add a new product'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name"
                          className="bg-gray-800 border-gray-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* SKU */}
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter SKU"
                          className="bg-gray-800 border-gray-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Product Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-gray-800">
                          <SelectItem value="simple">Simple</SelectItem>
                          <SelectItem value="variable">Variable</SelectItem>
                          <SelectItem value="grouped">Grouped</SelectItem>
                          <SelectItem value="external">External</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-gray-800">
                          <SelectItem value="publish">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-gray-800" />

              {/* Pricing */}
              <h3 className="text-lg font-semibold text-amber-400">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-400">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-8 bg-gray-800 border-gray-700 text-white"
                            value={safeNumberValue(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseFloat(e.target.value) : undefined
                              )
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Regular Price */}
                <FormField
                  control={form.control}
                  name="regularPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regular Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-400">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-8 bg-gray-800 border-gray-700 text-white"
                            value={safeNumberValue(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseFloat(e.target.value) : undefined
                              )
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Sale Price */}
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-400">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-8 bg-gray-800 border-gray-700 text-white"
                            value={safeNumberValue(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseFloat(e.target.value) : undefined
                              )
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-gray-800" />

              {/* Inventory */}
              <h3 className="text-lg font-semibold text-amber-400">Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Manage Stock */}
                <FormField
                  control={form.control}
                  name="manageStock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-gray-700 bg-gray-800/30">
                      <div className="space-y-0.5">
                        <FormLabel className="text-gray-300">Manage Stock</FormLabel>
                        <p className="text-sm text-gray-400">
                          Enable stock management at product level
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-amber-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Stock Quantity (conditional) */}
                {form.watch('manageStock') && (
                  <FormField
                    control={form.control}
                    name="stockQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="bg-gray-800 border-gray-700 text-white"
                            value={safeNumberValue(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseInt(e.target.value) : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {/* Stock Status */}
                <FormField
                  control={form.control}
                  name="stockStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select stock status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-gray-800">
                          <SelectItem value="instock">In Stock</SelectItem>
                          <SelectItem value="outofstock">Out of Stock</SelectItem>
                          <SelectItem value="onbackorder">On Backorder</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Sold Individually */}
                <FormField
                  control={form.control}
                  name="soldIndividually"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-gray-700 bg-gray-800/30">
                      <div className="space-y-0.5">
                        <FormLabel className="text-gray-300">Sold Individually</FormLabel>
                        <p className="text-sm text-gray-400">
                          Limit purchases to 1 item per order
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-amber-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-gray-800" />


              <Separator className="bg-gray-800" />

              {/* Purchase Note */}
              <FormField
                control={form.control}
                name="purchaseNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Note</FormLabel>
                    <FormControl>
                      <Textarea
                        value={field.value || ''}
                        placeholder="Enter purchase note for customers"
                        className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="sticky bottom-0 bg-gray-900 pt-4 pb-2 border-t border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-medium shadow-lg hover:shadow-amber-500/30 transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      {currentProduct ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : currentProduct ? (
                    'Update Product'
                  ) : (
                    'Create Product'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
