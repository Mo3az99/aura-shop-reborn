
-- Create categories table for product organization
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product images table for multiple images per product
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to products and categories
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view product images" ON public.product_images FOR SELECT USING (true);

-- Create policies for cart items (using session_id for anonymous users)
CREATE POLICY "Users can manage their cart items" ON public.cart_items FOR ALL USING (true);

-- Create policies for orders
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Anyone can create order items" ON public.order_items FOR ALL USING (true);

-- Admin policies (will be restricted to authenticated admin users later)
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admins can manage product images" ON public.product_images FOR ALL USING (true);

-- Insert sample categories
INSERT INTO public.categories (name, description, image_url) VALUES
('Jewelry', 'Beautiful handcrafted jewelry pieces', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'),
('Accessories', 'Stylish accessories for everyday wear', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80'),
('Bags', 'Premium quality bags and purses', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80');

-- Insert sample products
INSERT INTO public.products (title, description, price, sale_price, image_url, category_id, stock_quantity) 
SELECT 
  'Elegant Gold Necklace',
  'A beautiful handcrafted gold necklace perfect for any occasion',
  299.99,
  249.99,
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
  id,
  15
FROM public.categories WHERE name = 'Jewelry'
LIMIT 1;

INSERT INTO public.products (title, description, price, image_url, category_id, stock_quantity)
SELECT 
  'Designer Sunglasses',
  'Premium designer sunglasses with UV protection',
  149.99,
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
  id,
  25
FROM public.categories WHERE name = 'Accessories'
LIMIT 1;

INSERT INTO public.products (title, description, price, image_url, category_id, stock_quantity)
SELECT 
  'Luxury Handbag',
  'Handcrafted luxury handbag made from premium leather',
  399.99,
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
  id,
  10
FROM public.categories WHERE name = 'Bags'
LIMIT 1;
