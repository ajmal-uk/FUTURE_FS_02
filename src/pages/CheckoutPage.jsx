import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder, getProductById, getUserAddresses, addUserAddress } from '../firebase/db';
import '../styles/checkout.css';

const CheckoutPage = () => {
    const { currentUser, userProfile } = useAuth();
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Buy Now mode - single product
    const buyNowProductId = searchParams.get('product');
    const [buyNowProduct, setBuyNowProduct] = useState(null);

    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const [newAddress, setNewAddress] = useState({
        fullName: userProfile?.fullName || '',
        phone: userProfile?.phone || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
    });

    useEffect(() => {
        if (buyNowProductId) {
            fetchBuyNowProduct();
        }
        fetchAddresses();
    }, [buyNowProductId, currentUser]);

    const fetchBuyNowProduct = async () => {
        try {
            const product = await getProductById(buyNowProductId);
            if (product) {
                setBuyNowProduct({ ...product, quantity: 1 });
            }
        } catch (err) {
            console.error('Error fetching product:', err);
        }
    };

    const fetchAddresses = async () => {
        if (!currentUser) return;
        try {
            const userAddresses = await getUserAddresses(currentUser.uid);
            setAddresses(userAddresses);
            if (userAddresses.length > 0) {
                setSelectedAddress(userAddresses[0].id);
            } else {
                setShowAddForm(true);
            }
        } catch (err) {
            console.error('Error fetching addresses:', err);
        }
    };

    const handleAddressChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const addressId = await addUserAddress(currentUser.uid, newAddress);
            setAddresses([...addresses, { id: addressId, ...newAddress }]);
            setSelectedAddress(addressId);
            setShowAddForm(false);
        } catch (err) {
            console.error('Error adding address:', err);
        }
    };

    // Get items to checkout
    const checkoutItems = buyNowProduct ? [buyNowProduct] : cartItems;
    const checkoutTotal = buyNowProduct
        ? buyNowProduct.price
        : cartTotal;
    const tax = checkoutTotal * 0.18; // GST 18%
    const finalTotal = checkoutTotal + tax;

    const handlePayment = async () => {
        setLoading(true);

        const selectedAddr = addresses.find(a => a.id === selectedAddress);

        // Simulate Razorpay payment (in production, integrate real Razorpay)
        // For now, we'll create the order directly
        try {
            const order = {
                userId: currentUser.uid,
                items: checkoutItems.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity || 1,
                    subtotal: item.price * (item.quantity || 1)
                })),
                totalAmount: finalTotal,
                shippingAddress: selectedAddr,
                customerEmail: currentUser.email,
                paymentMethod: 'Razorpay',
                paymentStatus: 'paid'
            };

            // Simulate payment delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In production, you would:
            // 1. Create Razorpay order on backend
            // 2. Open Razorpay checkout
            // 3. Verify payment on backend
            // 4. Create order after verification

            await createOrder(order);

            if (!buyNowProduct) {
                clearCart();
            }

            setOrderId('ORD' + Date.now());
            setOrderComplete(true);
            setStep(3);
        } catch (err) {
            console.error('Payment failed:', err);
            alert('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (checkoutItems.length === 0 && !orderComplete) {
        return (
            <div className="checkout-page">
                <div className="empty-checkout">
                    <span className="empty-icon">🛒</span>
                    <h2>Nothing to checkout</h2>
                    <p>Add items to your cart to proceed with checkout.</p>
                    <button onClick={() => navigate('/products')} className="btn-primary">
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-header">
                <h1>Checkout</h1>
                <div className="checkout-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Address</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Payment</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Confirmation</span>
                    </div>
                </div>
            </div>

            {/* Step 3: Order Confirmation */}
            {step === 3 && orderComplete && (
                <div className="confirmation-section">
                    <div className="confirmation-card">
                        <span className="success-icon">✅</span>
                        <h2>Order Placed Successfully!</h2>
                        <p>Thank you for your purchase. Your order has been confirmed.</p>
                        <div className="order-id">Order ID: <strong>{orderId}</strong></div>
                        <div className="confirmation-actions">
                            <button onClick={() => navigate('/my-orders')} className="btn-primary">
                                View Orders
                            </button>
                            <button onClick={() => navigate('/products')} className="btn-secondary">
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {step < 3 && (
                <div className="checkout-layout">
                    <div className="checkout-main">
                        {/* Step 1: Address Selection */}
                        {step === 1 && (
                            <div className="address-section">
                                <h2>📍 Delivery Address</h2>

                                {addresses.length > 0 && !showAddForm && (
                                    <div className="address-list">
                                        {addresses.map(addr => (
                                            <div
                                                key={addr.id}
                                                className={`address-card ${selectedAddress === addr.id ? 'selected' : ''}`}
                                                onClick={() => setSelectedAddress(addr.id)}
                                            >
                                                <div className="address-radio">
                                                    <input
                                                        type="radio"
                                                        checked={selectedAddress === addr.id}
                                                        onChange={() => setSelectedAddress(addr.id)}
                                                    />
                                                </div>
                                                <div className="address-details">
                                                    <strong>{addr.fullName}</strong>
                                                    <p>{addr.addressLine1}</p>
                                                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                                                    <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                                                    <p>{addr.country}</p>
                                                    <p className="address-phone">📞 {addr.phone}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            className="btn-add-address"
                                            onClick={() => setShowAddForm(true)}
                                        >
                                            + Add New Address
                                        </button>
                                    </div>
                                )}

                                {showAddForm && (
                                    <form onSubmit={handleAddAddress} className="address-form">
                                        <h3>Add New Address</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Full Name</label>
                                                <input
                                                    name="fullName"
                                                    value={newAddress.fullName}
                                                    onChange={handleAddressChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Phone</label>
                                                <input
                                                    name="phone"
                                                    value={newAddress.phone}
                                                    onChange={handleAddressChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Address Line 1</label>
                                            <input
                                                name="addressLine1"
                                                value={newAddress.addressLine1}
                                                onChange={handleAddressChange}
                                                placeholder="Street address, P.O. box"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Address Line 2 (Optional)</label>
                                            <input
                                                name="addressLine2"
                                                value={newAddress.addressLine2}
                                                onChange={handleAddressChange}
                                                placeholder="Apartment, suite, unit, building"
                                            />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>City</label>
                                                <input
                                                    name="city"
                                                    value={newAddress.city}
                                                    onChange={handleAddressChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>State</label>
                                                <input
                                                    name="state"
                                                    value={newAddress.state}
                                                    onChange={handleAddressChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Postal Code</label>
                                                <input
                                                    name="postalCode"
                                                    value={newAddress.postalCode}
                                                    onChange={handleAddressChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Country</label>
                                                <input
                                                    name="country"
                                                    value={newAddress.country}
                                                    onChange={handleAddressChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="btn-primary">
                                                Save Address
                                            </button>
                                            {addresses.length > 0 && (
                                                <button
                                                    type="button"
                                                    className="btn-secondary"
                                                    onClick={() => setShowAddForm(false)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                )}

                                {selectedAddress && !showAddForm && (
                                    <button
                                        className="btn-primary btn-continue"
                                        onClick={() => setStep(2)}
                                    >
                                        Continue to Payment
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="payment-section">
                                <h2>💳 Payment</h2>

                                <div className="payment-method">
                                    <div className="payment-option selected">
                                        <input type="radio" checked readOnly />
                                        <div className="payment-info">
                                            <img
                                                src="https://razorpay.com/assets/razorpay-glyph.svg"
                                                alt="Razorpay"
                                                className="payment-logo"
                                            />
                                            <span>Pay with Razorpay</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="payment-note">
                                    <p>🔒 Your payment is secure. We don't store your card details.</p>
                                </div>

                                <div className="payment-actions">
                                    <button
                                        className="btn-secondary"
                                        onClick={() => setStep(1)}
                                    >
                                        ← Back to Address
                                    </button>
                                    <button
                                        className="btn-primary btn-pay"
                                        onClick={handlePayment}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : `Pay ₹${finalTotal.toFixed(0)}`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="checkout-sidebar">
                        <div className="order-summary">
                            <h3>Order Summary</h3>

                            <div className="summary-items">
                                {checkoutItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <img
                                            src={item.imageUrl || 'https://placehold.co/60'}
                                            alt={item.name}
                                        />
                                        <div className="summary-item-info">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-qty">Qty: {item.quantity || 1}</span>
                                        </div>
                                        <span className="item-price">
                                            ₹{(item.price * (item.quantity || 1)).toFixed(0)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{checkoutTotal.toFixed(0)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span className="free">FREE</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax (GST 18%)</span>
                                    <span>₹{tax.toFixed(0)}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>₹{finalTotal.toFixed(0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
