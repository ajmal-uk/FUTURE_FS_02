# 🚀 FutureStore: Premium AI-Enhanced E-Commerce Platform

**FutureStore** is a cutting-edge, high-performance e-commerce platform developed as part of the Full Stack Web Development Internship at Future Interns (Task 2: Develop a Mini E-Commerce Storefront). Built with **React 19, Vite, and Firebase**, it offers a seamless user experience featuring elegant glassmorphism design, real-time data synchronization, robust security, and an intuitive admin dashboard.

This project showcases essential full-stack competencies, including responsive UI/UX design, efficient state management, backend integration with cloud services, and optimized deployment strategies. It's designed to simulate a real-world e-commerce application while incorporating modern web development best practices.

🔗 **Live Demo**: [https://ajmal-uk.github.io/FUTURE_FS_02](https://ajmal-uk.github.io/FUTURE_FS_02)  
📂 **Repository**: [github.com/ajmal-uk/FUTURE_FS_02](https://github.com/ajmal-uk/FUTURE_FS_02)

## ✨ Key Features

### 🛍️ Shopping Experience
- **Advanced Search & Filters**: Smart filtering by category, price, ratings, and more for effortless product discovery.
- **Real-Time Inventory Management**: Instant updates to stock levels and dynamic pricing to prevent overselling.
- **Persistent Cart & Wishlist**: Session-persistent storage with Firebase synchronization for a uninterrupted shopping journey.
- **One-Click Buy Now**: Streamlined instant purchase option to reduce cart abandonment.
- **Flash Sales & Promotions**: Engaging countdown timers for limited-time offers to drive urgency and sales.

### 👤 User Features
- **Secure Authentication**: Supports email/password and Google Sign-In powered by Firebase Authentication.
- **Profile Management**: Users can update details, review order history, and track shipments in real-time.
- **Multiple Shipping Addresses**: Easy management of addresses for personalized checkout experiences.
- **Cross-Device Wishlist Sync**: Seamless synchronization across devices for a consistent user experience.

### 🛡️ Admin Dashboard
- **Real-Time Analytics**: Interactive charts and metrics for sales, user engagement, and performance insights.
- **Comprehensive CRUD Operations**: Full control over products, orders, and user accounts.
- **Advanced User Management**: Promote users to admin, ban/unban accounts, and perform bulk order updates.
- **Discount & Offer Management**: Tools to create, schedule, and track promotions effectively.

### 🎨 Design & Performance
- **Glassmorphism Aesthetics**: Modern, translucent UI elements with gradient accents for a premium, futuristic feel.
- **Smooth Animations**: Fluid transitions and interactions using Framer Motion.
- **Fully Responsive Design**: Mobile-first architecture ensuring optimal viewing on all devices.
- **Performance Optimizations**: Lightning-fast builds with Vite, lazy loading, and efficient bundling for superior speed.

## 🛠️ Tech Stack

| Category          | Technology                  |
|-------------------|-----------------------------|
| Framework        | React 19                   |
| Build Tool       | Vite                       |
| Backend          | Firebase (Auth + Firestore)|
| Routing          | React Router v6            |
| State Management | React Context API          |
| Styling          | Custom CSS3 + Glassmorphism|
| Animations       | Framer Motion              |
| Deployment       | GitHub Pages               |

## 📁 Project Structure

```
FUTURE_FS_02/
├── public/          # Static assets like index.html and favicon
├── src/
│   ├── assets/      # Images, icons, and other media
│   ├── components/  # Reusable UI components (e.g., ProductCard, Navbar)
│   ├── context/     # Context providers for auth, cart, and wishlist
│   ├── firebase/    # Firebase configuration and utility functions
│   ├── pages/       # Route-based pages (e.g., Home, ProductDetail)
│   │   └── admin/   # Protected admin routes (e.g., Dashboard, Users)
│   ├── router/      # Route definitions and authentication guards
│   ├── styles/      # Global CSS and component-specific styles
│   └── App.jsx      # Main application entry point
├── .gitignore       # Git ignore file
├── package.json     # Dependencies and scripts
├── vite.config.js   # Vite configuration
└── README.md        # This documentation
```

> **Note**: Regular users can register directly on the site. Admin privileges are granted via promotion in the dashboard for enhanced security.

## 🚀 Quick Start

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ajmal-uk/FUTURE_FS_02.git
   cd FUTURE_FS_02
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Locally**:
   ```bash
   npm run dev
   ```
   → Access the app at [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```
   → The optimized build will be in the `dist/` folder, ready for deployment.

## 🔥 Firebase Setup

To enable core features like authentication and real-time database:

1. Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password and Google providers).
3. Enable **Firestore Database** (opt for production mode to enforce security rules).
4. Copy your Firebase configuration and update `src/firebase/config.js`:
   ```js
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```
5. Restart the development server to apply changes.

> **Tip**: For testing, use Firebase's emulator suite to simulate backend services locally.

## �️ Firestore Database Schema

This application uses Firebase Firestore as its NoSQL database. Below are the detailed schemas for each collection and subcollection.

### 📋 Collections Overview

| Collection | Description | Document ID |
|------------|-------------|-------------|
| `users` | Stores user profiles, settings, and authentication data | Firebase Auth UID |
| `products` | Contains product catalog with pricing, offers, and inventory | Auto-generated |
| `orders` | Manages customer orders with status tracking and payment info | Auto-generated |

---

### 👤 `users` Collection

Each document represents a registered user.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | `string` | ✅ | User's display name |
| `email` | `string` | ✅ | User's email address |
| `role` | `string` | ✅ | User role: `"user"` or `"admin"` (default: `"user"`) |
| `phone` | `string` | ❌ | Contact phone number |
| `addressLine1` | `string` | ❌ | Primary street address |
| `addressLine2` | `string` | ❌ | Secondary address (apt, suite, etc.) |
| `city` | `string` | ❌ | City name |
| `state` | `string` | ❌ | State/Province |
| `postalCode` | `string` | ❌ | ZIP/Postal code |
| `country` | `string` | ❌ | Country name |
| `provider` | `string` | ✅ | Auth provider: `"password"` or `"google"` |
| `isBanned` | `boolean` | ❌ | Whether user is banned (default: `false`) |
| `bannedAt` | `timestamp` | ❌ | When user was banned |
| `defaultAddressId` | `string` | ❌ | Reference to default address document ID |
| `createdAt` | `timestamp` | ✅ | Account creation timestamp |

#### 📍 `users/{uid}/addresses` Subcollection

Stores multiple shipping addresses for each user.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | `string` | ✅ | Recipient name |
| `phone` | `string` | ✅ | Contact number |
| `addressLine1` | `string` | ✅ | Street address |
| `addressLine2` | `string` | ❌ | Additional address info |
| `city` | `string` | ✅ | City |
| `state` | `string` | ✅ | State/Province |
| `postalCode` | `string` | ✅ | ZIP/Postal code |
| `country` | `string` | ✅ | Country |
| `createdAt` | `timestamp` | ✅ | Address creation timestamp |

#### ❤️ `users/{uid}/wishlist` Subcollection

Stores products saved to user's wishlist.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Product ID (document ID matches product) |
| `name` | `string` | ✅ | Product name |
| `price` | `number` | ✅ | Product price |
| `imageUrl` | `string` | ✅ | Product image URL |
| `category` | `string` | ✅ | Product category |
| `addedAt` | `timestamp` | ✅ | When added to wishlist |

---

### 🛍️ `products` Collection

Each document represents a product in the catalog.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | ✅ | Product name/title |
| `description` | `string` | ✅ | Detailed product description |
| `price` | `number` | ✅ | Regular price in USD |
| `category` | `string` | ✅ | Product category (e.g., `"Electronics"`, `"Fashion"`) |
| `imageUrl` | `string` | ✅ | Primary product image URL |
| `stock` | `number` | ✅ | Available inventory count |
| `offer` | `object` | ❌ | Active promotional offer (see below) |
| `createdAt` | `timestamp` | ✅ | Product creation timestamp |

#### 🏷️ `offer` Object (Embedded in Products)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `discountPercent` | `number` | ✅ | Discount percentage (0-100) |
| `offerTitle` | `string` | ❌ | Promotional title (e.g., `"Flash Sale!"`) |
| `startDate` | `string` | ✅ | ISO date string for offer start |
| `endDate` | `string` | ✅ | ISO date string for offer end |
| `isFeatured` | `boolean` | ❌ | Show in featured deals section (default: `false`) |
| `createdAt` | `timestamp` | ✅ | When offer was created |

---

### 📦 `orders` Collection

Each document represents a customer order.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | `string` | ✅ | Reference to user UID |
| `items` | `array` | ✅ | Array of ordered products |
| `totalAmount` | `number` | ✅ | Order total in USD |
| `shippingAddress` | `object` | ✅ | Shipping destination details |
| `status` | `string` | ✅ | Order status (see status values below) |
| `paymentMethod` | `string` | ✅ | Payment method used |
| `paymentStatus` | `string` | ❌ | Payment status: `"pending"`, `"completed"`, `"failed"` |
| `paymentId` | `string` | ❌ | Payment transaction ID |
| `paidAt` | `timestamp` | ❌ | Payment completion timestamp |
| `estimatedDelivery` | `string` | ❌ | Expected delivery date |
| `cancelRequested` | `boolean` | ✅ | User requested cancellation (default: `false`) |
| `cancelReason` | `string` | ❌ | User's cancellation reason |
| `cancelRequestedAt` | `timestamp` | ❌ | When cancellation was requested |
| `cancelApproved` | `boolean` | ❌ | Admin approved cancellation |
| `cancelApprovedAt` | `timestamp` | ❌ | When cancellation was approved |
| `cancelRejectedAt` | `timestamp` | ❌ | When cancellation was rejected |
| `rejectionReason` | `string` | ❌ | Reason for order rejection |
| `rejectedAt` | `timestamp` | ❌ | When order was rejected |
| `approvedAt` | `timestamp` | ❌ | When order was approved |
| `createdAt` | `timestamp` | ✅ | Order placement timestamp |
| `updatedAt` | `timestamp` | ❌ | Last modification timestamp |

#### 📊 Order Status Values

| Status | Description |
|--------|-------------|
| `pending_approval` | Initial state - awaiting admin review |
| `approved` | Admin approved, ready for processing |
| `in_progress` | Being prepared/packed |
| `shipped` | Dispatched for delivery |
| `delivered` | Successfully delivered to customer |
| `cancelled` | Order cancelled (admin approved) |

#### 🛒 `items` Array Structure (Embedded in Orders)

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Product ID |
| `name` | `string` | Product name |
| `price` | `number` | Price per unit |
| `quantity` | `number` | Quantity ordered |
| `imageUrl` | `string` | Product image URL |

---

## �📱 Mobile Responsiveness

- **Adaptive Layouts**: Dynamic product grids that resize fluidly based on screen dimensions.
- **Collapsible Elements**: Intuitive navigation menus and sidebars for compact devices.
- **Touch Optimization**: Gesture-friendly controls, including swipe-to-navigate and tap interactions.
- **Performance Enhancements**: Lazy-loaded images, minimized JavaScript bundles, and optimized rendering for smooth mobile performance.

Thoroughly tested across smartphones, tablets, and desktops to ensure a uniform, high-quality experience.

## 🛡️ Security & Best Practices

- **Authentication Guards**: Protected routes prevent unauthorized access to admin features.
- **Data Validation**: Form inputs are sanitized and validated to mitigate common vulnerabilities.
- **Real-Time Sync**: Firebase's secure listeners ensure data integrity without exposing sensitive information.
- **Accessibility**: Adheres to WCAG standards with semantic HTML, ARIA labels, and keyboard navigation support.

## 🤝 Contributing

Contributions are welcome to evolve FutureStore! Follow these steps:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add your amazing feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-amazing-feature
   ```
5. Open a Pull Request with a detailed description, including any relevant issue references.

Adhere to coding standards, add unit tests for new features, and ensure compatibility with existing code.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for full details.

## 👨‍💻 Author

**MUHAMMED AJMAL U K**  
- 🔗 [GitHub Profile](https://github.com/ajmal-uk)  
- 📫 [Email](mailto:ajmaluk.me@gmail.com)  
- 💼 [LinkedIn](https://linkedin.com/in/ajmaluk)  

Developed during the Future Interns Full Stack Web Development Fellowship (November-December 2025).

⭐ If FutureStore inspires you, star the repo to fuel future enhancements!

---

Crafted with ❤️, innovative code, and endless coffee. Let's build the future of e-commerce! 🚀
