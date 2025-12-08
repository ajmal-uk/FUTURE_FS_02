# Mini E-Commerce Storefront (Future FS 02)

A production-ready mini e-commerce application built with **React** (Vite) and **Firebase**.

## Features

- **Storefront**: Browse products, filter by category, search by name.
- **Cart**: Add to cart, adjust quantities, checkout.
- **Authentication**: Local Email/Password + Google Login.
- **User Profile**: Manage profile details, view order history.
- **Admin Panel**:
  - Manage Products (CRUD, Stock).
  - Manage Orders (Update status).
  - Manage Users (Promote/Demote admins).
- **Security Check**: Role-based access control (Admin vs User).

## Tech Stack

- **Frontend**: React 18+ (Vite), React Router v6.
- **Styling**: Plain CSS (CSS Modules approach).
- **Backend/Database**: Firebase Authentication, Cloud Firestore.

## Setup & Running

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Firebase Setup

The app uses the following Firebase configuration (already in `src/firebase/config.js`):
- **Project ID**: `future-fs-02`
- **Auth**: Enabled for Email/Password and Google.
- **Firestore**: Collections for `users`, `products`, `orders`.

## Folder Structure

- `src/components`: Reusable UI components.
- `src/pages`: Main page components.
- `src/context`: React Context (Auth, Cart).
- `src/firebase`: Firebase config and helpers.
- `src/styles`: CSS files.
- `src/router`: Route definitions and guards.
