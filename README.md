# 🚀 FutureStore: Premium AI-Enhanced E-Commerce Platform

**FutureStore** is a modern, high-performance e-commerce platform built as part of the Full Stack Web Development Internship at Future Interns (Task 2: Develop a Mini E-Commerce Storefront). It leverages **React 19, Vite, and Firebase** to deliver a seamless shopping experience with glassmorphism aesthetics, real-time data sync, secure user authentication, and a robust admin dashboard.

This project demonstrates key full-stack skills, including frontend UI/UX design, state management, backend integration with Firebase, and deployment best practices.

🔗 **Live Demo**: [https://ajmal-uk.github.io/FUTURE_FS_02](https://ajmal-uk.github.io/FUTURE_FS_02)  
📂 **Repository**: [github.com/ajmal-uk/FUTURE_FS_02](https://github.com/ajmal-uk/FUTURE_FS_02)

## ✨ Key Features

### 🛍️ Shopping Experience
- **Advanced Search & Filters**: Intelligent filtering by category, price range, and ratings for quick product discovery.
- **Real-Time Inventory**: Dynamic stock updates and pricing adjustments.
- **Persistent Cart & Wishlist**: Items saved across sessions using local storage and Firebase sync.
- **One-Click Buy Now**: Instant checkout option for faster purchases.
- **Flash Sales**: Live countdown timers for time-limited deals to boost engagement.

### 👤 User Features
- **Secure Authentication**: Email/password login plus Google Sign-In via Firebase Auth.
- **Profile Management**: Edit personal details, view order history, and track shipments.
- **Multiple Addresses**: Save and manage shipping addresses for convenience.
- **Wishlist Sync**: Cross-device synchronization for a personalized experience.

### 🛡️ Admin Dashboard
- **Real-Time Analytics**: Interactive sales charts and performance metrics.
- **Full CRUD Operations**: Manage products, orders, and users effortlessly.
- **User Management**: Promote to admin, ban/unban users, and bulk update order statuses.
- **Discount Tools**: Create and manage offers, promotions, and discounts.

### 🎨 Design & Performance
- **Glassmorphism UI**: Sleek, translucent elements with gradient accents for a premium look.
- **Animations**: Smooth transitions powered by Framer Motion.
- **Responsive Design**: Mobile-first approach ensuring usability on all devices.
- **Optimized Performance**: Fast loading times thanks to Vite's bundling and lazy loading.

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

> **Note**: Regular users can sign up directly on the site. Admin access requires promotion via the dashboard.

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
   → Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 🔥 Firebase Setup

To enable authentication and real-time database features:

1. Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (select Email/Password and Google providers).
3. Enable **Firestore Database** (start in production mode for security).
4. Copy your Firebase config object and paste it into `src/firebase/config.js`:
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
5. Restart the development server for changes to take effect.

## 📱 Mobile Responsiveness

- **Adaptive Layouts**: Product grids that adjust based on screen size.
- **Collapsible Elements**: Navigation menus and sidebars for smaller devices.
- **Touch Optimization**: Swipe-friendly controls and gesture support.
- **Performance Tweaks**: Lazy-loaded images and minimized bundle sizes for faster mobile loading.

Tested on devices from smartphones to desktops for a consistent experience.

## 🤝 Contributing

We welcome contributions to enhance FutureStore! Here's how to get started:

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
5. Open a Pull Request with a clear description of your changes.

Please follow standard coding conventions and include tests where applicable.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**MUHAMMED AJMAL U K**  
- 🔗 [GitHub Profile](https://github.com/ajmal-uk)  
- 📫 Email: [Email] (ajmaluk.me@gmail.com)  
- 💼 LinkedIn: [LinkedIn] (https://linkedin.com/in/ajmal-uk)

This project was developed as part of the Future Interns Full Stack Web Development Fellowship (November 2025).

⭐ If you find FutureStore useful, give it a star to support ongoing development!

---

Made with ❤️, code, and copious amounts of coffee. 🚀
