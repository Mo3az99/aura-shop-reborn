import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import CategorySection from "@/components/CategorySection";
import Cart from "@/components/Cart";
import { useCart } from "@/hooks/useCart";


const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItemsCount } = useCart();

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
