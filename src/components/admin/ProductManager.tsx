import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, Package } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  sale_price?: number;
  image_url: string;
  category_id: string;
  stock_quantity: number;
  is_active: boolean;
  categories?: { name: string };
}

const ProductManager = () => {
  const queryClient = useQueryClient();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    sale_price: '',
    image_url: '',
    category_id: '',
    stock_quantity: '',
    is_active: true
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const addProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const { error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          price: parseFloat(productData.price),
          sale_price: productData.sale_price ? parseFloat(productData.sale_price) : null,
          stock_quantity: parseInt(productData.stock_quantity)
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsAddingProduct(false);
      resetForm();
      toast.success("Product added successfully!");
    },
    onError: () => {
      toast.error("Failed to add product");
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, productData }: { id: string; productData: any }) => {
      const { error } = await supabase
        .from('products')
        .update({
          ...productData,
          price: parseFloat(productData.price),
          sale_price: productData.sale_price ? parseFloat(productData.sale_price) : null,
          stock_quantity: parseInt(productData.stock_quantity)
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setEditingProduct(null);
      resetForm();
      toast.success("Product updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update product");
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success("Product deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete product");
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      sale_price: '',
      image_url: '',
      category_id: '',
      stock_quantity: '',
      is_active: true
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct, productData: formData });
    } else {
      addProductMutation.mutate(formData);
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product.id);
    setFormData({
      title: product.title,
      description: product.description || '',
      price: product.price.toString(),
      sale_price: product.sale_price?.toString() || '',
      image_url: product.image_url || '',
      category_id: product.category_id || '',
      stock_quantity: product.stock_quantity?.toString() || '0',
      is_active: product.is_active
    });
    setIsAddingProduct(true);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setIsAddingProduct(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-gray-600">Add, edit, and manage your products</p>
        </div>
        <Button
          onClick={() => setIsAddingProduct(true)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Add/Edit Product Form */}
      {isAddingProduct && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
            <CardDescription>
              {editingProduct ? 'Update product information' : 'Fill in the details to add a new product'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sale_price">Sale Price ($)</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    value={formData.sale_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, sale_price: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Product is active</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={addProductMutation.isPending || updateProductMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 space-x-1">
                {!product.is_active && (
                  <Badge variant="destructive">Inactive</Badge>
                )}
                {product.sale_price && (
                  <Badge className="bg-red-500">Sale</Badge>
                )}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{product.title}</h3>
                {product.categories && (
                  <Badge variant="outline">{product.categories.name}</Badge>
                )}
                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-emerald-600">
                      ${(product.sale_price || product.price).toFixed(2)}
                    </span>
                    {product.sale_price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(product)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProductMutation.mutate(product.id)}
                    disabled={deleteProductMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first product to the store</p>
            <Button
              onClick={() => setIsAddingProduct(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductManager;
