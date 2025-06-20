import React, { useEffect, useState, useRef } from "react";
import { ShoppingCart, Menu, Heart, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import UserAuth from "@/components/UserAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const Header = ({ setIsCartOpen }: { setIsCartOpen: (open: boolean) => void }) => {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const authRef = useRef<HTMLDivElement>(null);
  const { cartItemsCount } = useCart();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authRef.current && !authRef.current.contains(event.target as Node)) {
        setShowAuthPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-beige shadow-sm relative z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className=" text-brown text-xl font-bold">AURA</Link>

        <nav className="hidden md:flex space-x-6">
          <Link to="/about" className="text-brown hover:text-black">About Us</Link>
          <Link to="/contact" className="text-brown hover:text-black">Contact</Link>
          <Link to="/checkout" className="text-brown hover:text-black">Checkout</Link>
          {user?.email === "admin@aura.com" && (
            <Link to="/admin" className="text-brown hover:text-black">Admin</Link>
          )}
        </nav>

        <div className="bg-beige flex items-center space-x-4 relative">
          <Input placeholder="Search" className="bg-beige hidden md:block w-48" />
          <Heart className="cursor-pointer" />
          <User className="cursor-pointer" onClick={() => setShowAuthPopup(prev => !prev)} />
          <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brown text-beige rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </div>
          <Menu className="md:hidden cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </div>
      </div>

      {showAuthPopup && (
        <div
          ref={authRef}
          className="absolute right-4 top-[70px] bg-beige border shadow-md rounded-md z-50 p-4 w-64"
        >
          <UserAuth />
        </div>
      )}
    </header>
  );
};

export default Header;
