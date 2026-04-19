# 🛒 Grocery E-Commerce Web Application

A full-stack grocery web application that allows users to browse products, add items to cart, and place orders online. It also includes an admin panel to manage products, users, and orders.

---

## 🚀 Features

### 👤 Customer (User)

* User Registration & Login (JWT Authentication)
* Browse grocery products by category
* Search, filter, and sort products
* View product details
* Add to cart & manage cart
* Place orders
* View order history
* User dashboard

### 🛠️ Admin Panel

* Admin login
* Dashboard with stats (users, products, orders, revenue)
* Manage products (Add / Edit / Delete)
* Manage orders (Update status)
* Manage users (View / Delete / Block)

---

## 🧑‍💻 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Authentication

* JSON Web Tokens (JWT)
* Bcrypt (password hashing)

---

## 📁 Project Structure

```
grocery-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.js
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/your-username/grocery-app.git
cd grocery-app
```

---

### 🔹 2. Setup Backend

```bash
cd backend
npm install
```

#### Create `.env` file in `/backend`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

#### Run Backend:

```bash
npm run dev
```

---

### 🔹 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🌐 API Endpoints

### 🔐 Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### 📦 Products

* GET `/api/products`
* GET `/api/products/:id`
* POST `/api/products` (Admin)
* PUT `/api/products/:id` (Admin)
* DELETE `/api/products/:id` (Admin)

### 🛒 Cart

* GET `/api/cart`
* POST `/api/cart`

### 📑 Orders

* POST `/api/orders`
* GET `/api/orders`
* GET `/api/orders/all` (Admin)
* PUT `/api/orders/:id`

### 👥 Users

* GET `/api/users` (Admin)
* DELETE `/api/users/:id` (Admin)

---

## 🔐 Security

* Passwords hashed using bcrypt
* JWT-based authentication
* Protected routes (Admin/User roles)
* Input validation (optional)

---

## 🎨 UI Design

* Clean and modern grocery UI
* Fully responsive (mobile, tablet, desktop)
* Reusable components

---

## ⚡ Optional Features

* Wishlist
* Product reviews & ratings
* Payment integration (Stripe)
* Image upload (Cloudinary)
* Dark mode

---

## 🚀 Deployment

### Frontend:

* Vercel
* Netlify

### Backend:

* Render
* Railway

### Database:

* MongoDB Atlas

---
