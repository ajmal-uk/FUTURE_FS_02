import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import { Header, Footer } from '../components/Layout';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CompleteProfilePage from '../pages/CompleteProfilePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import MyOrdersPage from '../pages/MyOrdersPage';
import AddressPage from '../pages/AddressPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';


const AppRouter = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <Header />
                <main style={{ minHeight: '80vh' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        <Route path="/complete-profile" element={
                            <PrivateRoute>
                                <CompleteProfilePage />
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
            </CartProvider>
        </AuthProvider>
    );
};

export default AppRouter;
