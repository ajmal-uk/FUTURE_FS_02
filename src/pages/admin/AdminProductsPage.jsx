import { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../firebase/db';

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
                            <label>Price ($)</label>
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
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
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
                                    <td><strong>${product.price?.toFixed(2)}</strong></td>
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
        </div>
    );
};

export default AdminProductsPage;
