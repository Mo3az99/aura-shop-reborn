import React from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, cartTotal = 0, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-4">
                <img
                  src={item.products?.image_url || "/placeholder.svg"}
                  alt={item.products?.title}
                  className="w-16 h-16 object-cover border"
                />
                <div>
                  <p className="font-semibold">{item.products?.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p>{((item.products?.sale_price || item.products?.price || 0) * item.quantity).toFixed(2)} EGP</p>
                <Button
                  onClick={() => removeFromCart(item.id)}
                  variant="ghost"
                  className="text-red-500 text-xs mt-1"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-6">
            <p className="text-lg font-semibold">Total:</p>
            <p className="text-lg font-bold">{cartTotal.toFixed(2)} EGP</p>
          </div>
          <div className="text-right">
            <Button className="bg-black text-white" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
