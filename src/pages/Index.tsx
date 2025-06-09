
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Menu, X, Search, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import CategorySection from "@/components/CategorySection";
import Cart from "@/components/Cart";
import { useCart } from "@/hooks/useCart";

import Header from "@/components/Header";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems, cartItemsCount } = useCart();

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

  const { data: products = [] } = useQuery({
    queryKey: ['products', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-2 text-sm border-b border-gray-100">
            <div className="text-gray-600">Free shipping on orders over $50</div>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>Follow us</span>
              <div className="flex space-x-2">
                <a href="#" className="hover:text-black">Facebook</a>
                <a href="#" className="hover:text-black">Instagram</a>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black tracking-wider">AURA ACCESSORIES</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-800 hover:text-black font-medium">HOME</a>
              <a href="#products" className="text-gray-800 hover:text-black font-medium">SHOP</a>
              <a href="#categories" className="text-gray-800 hover:text-black font-medium">COLLECTIONS</a>
              <a href="#" className="text-gray-800 hover:text-black font-medium">ABOUT</a>
              <a href="#" className="text-gray-800 hover:text-black font-medium">CONTACT</a>
              <a href="/admin" className="text-gray-800 hover:text-black font-medium">ADMIN</a>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 text-gray-700 cursor-pointer hover:text-black" />
              <User className="h-5 w-5 text-gray-700 cursor-pointer hover:text-black" />
              <Heart className="h-5 w-5 text-gray-700 cursor-pointer hover:text-black" />
              <button 
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-black" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-black focus:ring-0"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/20" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-4">
              <a href="#" className="block text-gray-700 hover:text-black font-medium">HOME</a>
              <a href="#products" className="block text-gray-700 hover:text-black font-medium">SHOP</a>
              <a href="#categories" className="block text-gray-700 hover:text-black font-medium">COLLECTIONS</a>
              <a href="#" className="block text-gray-700 hover:text-black font-medium">ABOUT</a>
              <a href="#" className="block text-gray-700 hover:text-black font-medium">CONTACT</a>
              <a href="/admin" className="block text-gray-700 hover:text-black font-medium">ADMIN</a>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gray-100 flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-light mb-4 tracking-wide">DISCOVER YOUR STYLE</h1>
          <p className="text-lg md:text-xl mb-8 font-light">Elegant accessories for the modern woman</p>
          <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 font-medium">
            <a href="#products">SHOP NOW</a>
          </Button>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 tracking-wide text-black">SHOP BY CATEGORY</h2>
          <CategorySection categories={categories} />
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 tracking-wide text-black">FEATURED PRODUCTS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-light mb-4 tracking-wide">STAY IN TOUCH</h3>
          <p className="text-gray-300 mb-8">Subscribe to get special offers and updates</p>
          <div className="max-w-md mx-auto flex">
            <Input 
              placeholder="Enter your email"
              className="bg-white text-black border-0 rounded-r-none"
            />
            <Button className="bg-white text-black hover:bg-gray-100 rounded-l-none font-medium">
              SUBSCRIBE
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-4 border-t border-gray-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 tracking-wide">AURA ACCESSORIES</h3>
              <p className="text-gray-600 text-sm">Elegant accessories for the modern woman</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">SHOP</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">All Products</a></li>
                <li><a href="#" className="hover:text-black">New Arrivals</a></li>
                <li><a href="#" className="hover:text-black">Best Sellers</a></li>
                <li><a href="#" className="hover:text-black">Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">CUSTOMER CARE</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">Contact Us</a></li>
                <li><a href="#" className="hover:text-black">Shipping Info</a></li>
                <li><a href="#" className="hover:text-black">Returns</a></li>
                <li><a href="#" className="hover:text-black">Size Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">FOLLOW US</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">Instagram</a></li>
                <li><a href="#" className="hover:text-black">Facebook</a></li>
                <li><a href="#" className="hover:text-black">Pinterest</a></li>
                <li><a href="#" className="hover:text-black">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 mt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 Aura Accessories. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Index;
