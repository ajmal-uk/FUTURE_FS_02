# 🚀 FutureStore — Premium AI-Enhanced E-Commerce Platform

**A modern, blazing-fast e-commerce experience** built with **React 19 + Vite + Firebase**, featuring glassmorphism design, real-time synchronization, secure authentication, and a full-featured admin dashboard.

🔗 **Live Demo**: [https://ajmal-uk.github.io/FUTURE_FS_02](https://ajmal-uk.github.io/FUTURE_FS_02)

https://user-images.githubusercontent.com/91336447/284951277-89c0c0ff-8a3d-4e6f-9e0b-3f8e0f9d8e6f.mp4

## ✨ Key Features

### 🛍️ Shopping Experience
- Advanced search & smart filters (category, price, rating)
- Real-time stock & dynamic pricing
- Persistent cart & wishlist (saved across sessions)
- One-click "Buy Now" instant checkout
- Flash sales with live countdown timers

### 👤 User Features
- Email/Password + Google Sign-In (Firebase Auth)
- Complete user profile management
- Order history & tracking
- Multiple shipping addresses
- Wishlist synchronization

### 🛡️ Admin Dashboard (Powerful & Intuitive)
- Real-time analytics & sales charts
- Full CRUD for products, orders & users
- Promote users to admin with one click
- Ban/unban users
- Bulk order status updates
- Offer/discount management

### 🎨 Design & Performance
- Stunning **glassmorphism** UI with gradient accents
- Smooth animations (Framer Motion)
- Fully responsive (mobile-first approach)
- Lightning-fast loads with Vite

## 🛠️ Tech Stack

| Category              | Technology                  |
|-----------------------|-----------------------------|
| Framework             | React 19                    |
| Build Tool            | Vite                        |
| Backend               | Firebase (Auth + Firestore) |
| Routing               | React Router v6             |
| State Management      | React Context API           |
| Styling               | Custom CSS3 + Glassmorphism |
| Deployment            | GitHub Pages                |

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # Auth, Cart, Wishlist providers
├── firebase/       # Firebase config & helpers
├── pages/          # Public + Admin routes
│   └── admin/      # Protected admin panel
├── router/         # Route guards & navigation
├── styles/         # Global & component styles
└── assets/         # Images, icons, etc.
```

## 🔐 Demo Credentials (Admin Access)

| Role  | Email              | Password |
|-------|--------------------|----------|
| Admin | `admin@gmail.com`  | `123456` |

> Regular users can register directly on the site.

## 🚀 Quick Start

```bash
git clone https://github.com/ajmal-uk/FUTURE_FS_02.git
cd FUTURE_FS_02
npm install
npm run dev
```

→ Open [http://localhost:5173](http://localhost:5173)

## 🔥 Firebase Setup

1. Create a Firebase project
2. Enable **Authentication** (Email/Password + Google)
3. Enable **Firestore Database** (start in production mode)
4. Copy your config into `src/firebase/config.js`

```js
const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx"
};
```

## 📱 Fully Mobile Responsive

- Adaptive product grid
- Collapsible navigation
- Touch-optimized controls
- Optimized images & lazy loading

## 🤝 Contributing

Contributions are very welcome! 🎉

```bash
git checkout -b feature/amazing-feature
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

Then open a Pull Request.

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

## 👨‍💻 Author

**Ajmal U K**  
🔗 [GitHub Profile](https://github.com/ajmal-uk)

⭐ **Enjoying FutureStore? Star this repo to support future updates!**

---
Made with ❤️ and lots of coffee