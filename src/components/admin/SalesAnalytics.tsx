
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, Package, TrendingUp } from "lucide-react";

const SalesAnalytics = () => {
  const { data: analytics } = useQuery({
    queryKey: ['sales-analytics'],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            products (title)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate analytics
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const totalOrders = orders.length;

      // This month analytics
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      });
      
      const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);

      // Last month analytics
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const lastMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
      });
      
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      
      // Calculate growth
      const revenueGrowth = lastMonthRevenue > 0 ? 
        ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

      // Top products
      const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
      
      orders.forEach(order => {
        order.order_items?.forEach(item => {
          const productTitle = item.products?.title || 'Unknown Product';
          if (!productSales[productTitle]) {
            productSales[productTitle] = { name: productTitle, quantity: 0, revenue: 0 };
          }
          productSales[productTitle].quantity += item.quantity;
          productSales[productTitle].revenue += item.quantity * Number(item.price);
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Recent orders
      const recentOrders = orders.slice(0, 10);

      return {
        totalRevenue,
        totalOrders,
        thisMonthRevenue,
        thisMonthOrders: thisMonthOrders.length,
        lastMonthRevenue,
        revenueGrowth,
        topProducts,
        recentOrders
      };
    }
  });

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sales Analytics</h2>
        <p className="text-gray-600">Monitor your store's performance and sales trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics?.thisMonthRevenue || 0)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span className={analytics?.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                {analytics?.revenueGrowth?.toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.thisMonthOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total orders this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              All-time revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              All-time orders
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.topProducts?.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.quantity} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.recentOrders?.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">#{order.order_number}</p>
                    <p className="text-sm text-gray-500">{order.customer_name}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(Number(order.total_amount))}</p>
                    <Badge 
                      variant={order.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesAnalytics;
