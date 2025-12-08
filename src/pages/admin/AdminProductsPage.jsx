import { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct, setProductOffer, removeProductOffer } from '../../firebase/db';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Sports', 'Food', 'Other'];

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        imageUrl: '',
        stock: 10
    });
    const [showOfferModal, setShowOfferModal] = useState(null);
    const [offerData, setOfferData] = useState({
        discountPercent: 10,
        offerTitle: '',
        startDate: '',
        endDate: '',
        isFeatured: false
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(id);
            fetchProducts();
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            category: product.category || 'Electronics',
            imageUrl: product.imageUrl || '',
            stock: product.stock || 0
        });
        setShowForm(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: 'Electronics',
            imageUrl: '',
            stock: 10
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock)
        };

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
            } else {
                await createProduct(productData);
            }
            setShowForm(false);
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert("Error saving product");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOfferSubmit = async (productId) => {
        try {
            await setProductOffer(productId, offerData);
            setShowOfferModal(null);
            setOfferData({ discountPercent: 10, offerTitle: '', startDate: '', endDate: '', isFeatured: false });
            fetchProducts();
            alert('Offer scheduled successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to set offer');
        }
    };

    const handleRemoveOffer = async (productId) => {
        if (window.confirm('Remove this offer?')) {
            try {
                await removeProductOffer(productId);
                fetchProducts();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div className="admin-products">
            <div className="admin-page-header">
                <h1>Products</h1>
                <button onClick={handleAddNew} className="btn-primary">
                    ➕ Add Product
                </button>
            </div>

            {showForm && (
                <div className="product-form-container">
                    <h3>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
                    <form onSubmit={handleSubmit} className="product-form">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Stock Quantity</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="10"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter product description..."
                                rows={3}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingProduct ? 'Save Changes' : 'Add Product'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="products-table">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Offer</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No products yet. Add your first product!
                                </td>
                            </tr>
                        ) : (
                            products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <img
                                            src={product.imageUrl || 'https://placehold.co/50'}
                                            alt={product.name}
                                            className="product-image-small"
                                        />
                                    </td>
                                    <td>
                                        <strong>{product.name}</strong>
                                        <br />
                                        <small style={{ color: 'var(--text-secondary)' }}>
                                            {product.description?.substring(0, 50)}...
                                        </small>
                                    </td>
                                    <td>
                                        <span className="badge badge-primary">{product.category}</span>
                                    </td>
                                    <td><strong>₹{product.price?.toFixed(0)}</strong></td>
                                    <td>
                                        {product.stock > 0 ? (
                                            <span className={product.stock <= 5 ? 'text-warning' : ''}>
                                                {product.stock} units
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--error-color)' }}>Out of stock</span>
                                        )}
                                    </td>
                                    <td>
                                        {product.offer ? (
                                            <div style={{ fontSize: '0.8rem' }}>
                                                <span style={{ background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                                                    {product.offer.discountPercent}% OFF
                                                </span>
                                                {product.offer.isFeatured && (
                                                    <span style={{ marginLeft: '4px', color: '#f59e0b' }}>⭐</span>
                                                )}
                                                <br />
                                                <button
                                                    onClick={() => handleRemoveOffer(product.id)}
                                                    style={{ fontSize: '0.7rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', marginTop: '4px' }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowOfferModal(product)}
                                                style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'var(--primary-gradient)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                + Add Offer
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="btn-edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Offer Modal */}
            {showOfferModal && (
                <div className="modal-overlay" onClick={() => setShowOfferModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>🏷️ Schedule Offer for {showOfferModal.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Set discount percentage and schedule dates for this product.
                        </p>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Discount %</label>
                            <input
                                type="number"
                                min="1"
                                max="90"
                                value={offerData.discountPercent}
                                onChange={(e) => setOfferData({ ...offerData, discountPercent: Number(e.target.value) })}
                                style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Offer Title (optional)</label>
                            <input
                                type="text"
                                placeholder="e.g., Summer Sale, Festival Offer"
                                value={offerData.offerTitle}
                                onChange={(e) => setOfferData({ ...offerData, offerTitle: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Start Date</label>
                                <input
                                    type="date"
                                    value={offerData.startDate}
                                    onChange={(e) => setOfferData({ ...offerData, startDate: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: '8px' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>End Date</label>
                                <input
                                    type="date"
                                    value={offerData.endDate}
                                    onChange={(e) => setOfferData({ ...offerData, endDate: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border-color)', borderRadius: '8px' }}
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={offerData.isFeatured}
                                    onChange={(e) => setOfferData({ ...offerData, isFeatured: e.target.checked })}
                                />
                                <span>⭐ Feature in Today's Deals (Homepage)</span>
                            </label>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowOfferModal(null)}>
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => handleOfferSubmit(showOfferModal.id)}
                                disabled={!offerData.startDate || !offerData.endDate}
                            >
                                Schedule Offer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductsPage;

