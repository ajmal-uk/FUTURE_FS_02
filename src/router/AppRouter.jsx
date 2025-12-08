import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import { Header, Footer } from '../components/Layout';
import { WishlistProvider } from '../context/WishlistContext';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CompleteProfilePage from '../pages/CompleteProfilePage';
import ProfilePage from '../pages/ProfilePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import MyOrdersPage from '../pages/MyOrdersPage';
import AddressPage from '../pages/AddressPage';
import BannedPage from '../pages/BannedPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';


const AppRouter = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    <Header />
                    <main style={{ minHeight: '80vh' }}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/banned" element={<BannedPage />} />

                            <Route path="/complete-profile" element={
                                <PrivateRoute>
                                    <CompleteProfilePage />
                                </PrivateRoute>
                            } />
                            <Route path="/profile" element={
                                <PrivateRoute>
                                    <ProfilePage />
                                </PrivateRoute>
                            } />

                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/product/:id" element={<ProductDetailPage />} />

                            <Route path="/cart" element={
                                <PrivateRoute>
                                    <CartPage />
                                </PrivateRoute>
                            } />
                            <Route path="/checkout" element={
                                <PrivateRoute>
                                    <CheckoutPage />
                                </PrivateRoute>
                            } />
                            <Route path="/my-orders" element={
                                <PrivateRoute>
                                    <MyOrdersPage />
                                </PrivateRoute>
                            } />
                            <Route path="/addresses" element={
                                <PrivateRoute>
                                    <AddressPage />
                                </PrivateRoute>
                            } />

                            {/* Admin Routes */}
                            <Route path="/admin/*" element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            } />
                        </Routes>
                    </main>
                    <Footer />
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    );
};

export default AppRouter;
