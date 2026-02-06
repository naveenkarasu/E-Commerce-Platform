import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice } from '@/lib/utils';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useToastStore } from '@/hooks/useToast';
import type { ProductFormData } from '@/types';

const emptyForm: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  category: '',
  stockQuantity: 0,
};

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const addToast = useToastStore((s) => s.addToast);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);

  const handleOpen = (product?: { id: number } & ProductFormData) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        stockQuantity: product.stockQuantity,
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stockQuantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProduct.mutateAsync({ id: editingId, data: formData });
        addToast('Product updated successfully.', 'success');
      } else {
        await createProduct.mutateAsync(formData);
        addToast('Product created successfully.', 'success');
      }
      handleClose();
    } catch {
      addToast('Failed to save product.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct.mutateAsync(id);
      addToast('Product deleted.', 'success');
    } catch {
      addToast('Failed to delete product.', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Products</h1>
          <p className="mt-1 text-stone-500">Manage your product catalog</p>
        </div>
        <Button onClick={() => handleOpen()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Products ({products?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-3 px-4 font-medium text-stone-500">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-500">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-500">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-500">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-500">Stock</th>
                    <th className="text-right py-3 px-4 font-medium text-stone-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product) => (
                    <tr key={product.id} className="border-b border-stone-200 hover:bg-amber-50">
                      <td className="py-3 px-4 text-stone-600">{product.id}</td>
                      <td className="py-3 px-4 font-medium text-stone-900">{product.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{product.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-stone-900">{formatPrice(product.price)}</td>
                      <td className="py-3 px-4">
                        <span className={product.stockQuantity <= 5 ? 'text-red-600 font-medium' : 'text-stone-600'}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpen(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>{editingId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <Textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Price</label>
              <Input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Stock</label>
              <Input
                name="stockQuantity"
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
            <Input name="category" value={formData.category} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
            <Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
