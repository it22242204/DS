import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { OrderProvider } from "./contexts/OrderContext";

// Pages
import HomePage from "@/pages/HomePage";
import RestaurantsPage from "@/pages/RestaurantsPage";
import RestaurantDetailPage from "@/pages/RestaurantDetailPage";
import CartPage from "@/pages/CartPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import OrdersPage from "@/pages/OrdersPage";
import NotificationsTestPage from "@/pages/NotificationsTestPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminRestaurantsPage from "@/pages/admin/AdminRestaurantsPage";
import AdminFinancesPage from "@/pages/admin/AdminFinancesPage";
import AdminNotificationsPage from "@/pages/admin/AdminNotificationsPage";
import NotFound from "./pages/NotFound";
// import AddToCart from "./pages/Order/AddToCart";
// import EditCartItems from "./pages/Order/EditCartItems";
// import Carts from "./pages/Order/Carts";

// Delivery Pages
import Deliverydashboard from "./pages/delivery/deliverydashboard";
import LiveTracking from "./pages/delivery/LiveTracking";
import Earnings from "./pages/delivery/Earnings";
import DeliveryDetails from "./pages/delivery/DeliveryDetails";
import DeliveryProfile from "./pages/delivery/Profile";
import Notifications from "./pages/delivery/Notification";
import AssignDriverPage from "./pages/delivery/AssignDriverPage";

// Restaurant Admin Pages
import RestaurantDashboard from "./pages/resturent/Dashboard";
import RestaurantMenu from "./pages/resturent/Menu";
import RestaurantOrders from "./pages/resturent/Orders";
import RestaurantProfile from "./pages/resturent/Profile";
import RestaurantNotification from "./pages/resturent/Notifications";
import RestaurantSettings from "./pages/resturent/Settings";
import AddMenuItem from "./pages/resturent/AddMenuItem";

//Payment Pages
import PaymentSuccess from "./pages/User/Payment/PaymentSuccess";
import PaymentCancel from "./pages/User/Payment/PaymentCancel";;
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <OrderProvider>
          <CartProvider>
            <NotificationProvider>
              <AdminProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
                    <Route path="/restaurants" element={<MainLayout><RestaurantsPage /></MainLayout>} />
                    <Route path="/restaurants/:id" element={<MainLayout><RestaurantDetailPage /></MainLayout>} />
                    <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
                    <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
                    <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
                    <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
                    <Route path="/orders" element={<MainLayout><OrdersPage /></MainLayout>} />
                    <Route path="/notifications-test" element={<MainLayout><NotificationsTestPage /></MainLayout>} />
                    {/* <Route path="/add-to-cart" element={<MainLayout><AddToCart /></MainLayout>} /> */}
                    {/* <Route path="/edit-cart/:id" element={<MainLayout><EditCartItems /></MainLayout>} /> */}
                    {/* <Route path="/view-cart" element={<MainLayout><Carts /></MainLayout>} /> */}
                    
                    
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<MainLayout><AdminDashboardPage /></MainLayout>} />
                    <Route path="/admin/users" element={<MainLayout><AdminUsersPage /></MainLayout>} />
                    <Route path="/admin/restaurants" element={<MainLayout><AdminRestaurantsPage /></MainLayout>} />
                    <Route path="/admin/finances" element={<MainLayout><AdminFinancesPage /></MainLayout>} />
                    <Route path="/admin/notifications" element={<MainLayout><AdminNotificationsPage /></MainLayout>} />
                    
                    {/* Delivery Routes */}
                    <Route path="/deliver" element={<MainLayout><Deliverydashboard /></MainLayout>} />
                    <Route path="/deliver/live-tracking" element={<MainLayout><LiveTracking /></MainLayout>} />
                    <Route path="/deliver/earning" element={<MainLayout><Earnings /></MainLayout>} />
                    <Route path="/deliver/profile" element={<MainLayout><DeliveryProfile /></MainLayout>} />
                    <Route path="/deliver/delivery-details" element={<MainLayout><DeliveryDetails /></MainLayout>} />
                    <Route path="/deliver/notifications" element={<MainLayout><Notifications /></MainLayout>} />
                    <Route path="/deliver/assignDriver" element={<MainLayout><AssignDriverPage /></MainLayout>} />
                    
                    {/* Restaurant Admin Routes */}
                    <Route path="/resturent" element={<MainLayout><RestaurantDashboard /></MainLayout>} />
                    <Route path="/resturent/menu" element={<MainLayout><RestaurantMenu /></MainLayout>} />
                    <Route path="/resturent/menu/add" element={<MainLayout><AddMenuItem /></MainLayout>} />
                    <Route path="/resturent/orders" element={<MainLayout><RestaurantOrders /></MainLayout>} />
                    <Route path="/resturent/profile" element={<MainLayout><RestaurantProfile /></MainLayout>} />
                    <Route path="/resturent/notifications" element={<MainLayout><RestaurantNotification /></MainLayout>} />
                    <Route path="/resturent/settings" element={<MainLayout><RestaurantSettings /></MainLayout>} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />

                    {/* Payment Routes */}
                    <Route path="/payment-success" element={<MainLayout><PaymentSuccess /></MainLayout>} />
                    <Route path="/payment-cancel" element={<MainLayout><PaymentCancel /></MainLayout>} />


                  </Routes>
                </BrowserRouter>
              </AdminProvider>
            </NotificationProvider>
          </CartProvider>
          </OrderProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
