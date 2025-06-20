
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  sale_price?: number;
  image_url: string;
  stock_quantity: number;
  categories?: { name: string };
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

const handleAddToCart = () => {
  addToCart(product.id);
  toast.success("Added to cart!", {
    duration: 3000 // auto-dismiss after 3 seconds
  });
};

  const displayPrice = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  return (
    <div 
      className="group relative bg-beige transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.title}
          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Quick Actions - Show on Hover */}
        <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              className={`bg-beige hover:bg-gray-100 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-600'
              }`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="w-full bg-brown hover:bg-gray-800 text-beige font-medium py-3"
            >
              {product.stock_quantity === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </Button>
          </div>
        </div>

        {/* Sale Badge */}
        {hasDiscount && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-500 text-beige font-medium">
              SALE
            </Badge>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-beige/80 flex items-center justify-center">
            <span className="text-gray-600 font-medium">OUT OF STOCK</span>
          </div>
        )}
      </div>
      
      <div className="pt-4 text-center">
        <h3 className="font-medium text-brown mb-2 tracking-wide">{product.title}</h3>
        
        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg font-medium text-brown">
            ${displayPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
