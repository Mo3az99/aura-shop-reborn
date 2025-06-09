import { useState } from "react";
import { ShoppingCart, Menu, X, Search, User, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

import { useEffect, useState } from "react";
import UserAuth from "@/components/UserAuth";
import { supabase } from "@/integrations/supabase/client";

const Header = ({ setIsCartOpen }: { setIsCartOpen: (open: boolean) => void }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItemsCount } = useCart();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">AURA</div>
        <nav className="hidden md:flex space-x-6">
          <a href="/about" className="text-gray-700 hover:text-black">About Us</a>
          <a href="/contact" className="text-gray-700 hover:text-black">Contact</a>
          <a href="/checkout" className="text-gray-700 hover:text-black">Checkout</a>
          {user?.email === "admin@example.com" && (
            <a href="/admin" className="text-gray-700 hover:text-black">Admin</a>
          )}
          <a href="#" className="text-gray-700 hover:text-black">Home</a>
          <a href="#" className="text-gray-700 hover:text-black">Shop</a>
          <a href="#" className="text-gray-700 hover:text-black">Contact</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Input placeholder="Search" className="hidden md:block w-48" />
          <Heart className="cursor-pointer" />
          <User className="cursor-pointer" />
          <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </div>
          <Menu className="md:hidden cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
                <UserAuth />
      </div>
    </header>
  );
};

export default Header;