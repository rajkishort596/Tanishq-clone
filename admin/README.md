# 💎Tanishq E-commerce Admin Dashboard

This is the official admin dashboard for the **Tanishq e-commerce platform**. It is a modern, single-page application built with **React** and **Vite**, designed to manage all aspects of the e-commerce store, including products, categories, orders, and user data.

---

## 🚀 Features

- **Product Management**: Create, view, update, and delete product listings.
- **User & Role Management**: Administer users, manage their roles and permissions.
- **Order Processing**: View and manage customer orders in real-time.
- **Dynamic Data**: Utilizes `@tanstack/react-query` for efficient data fetching, caching, and state management.
- **API Integration**: Seamlessly connects with the Tanishq backend API using `axios`.

---

## 🛠️ Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast, modern build tool for front-end development.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **React Router**: For client-side routing.
- **React Query**: For server-state management and data synchronization.
- **Redux Toolkit**: For global state management (if needed for complex state).
- **Axios**: A promise-based HTTP client for making API requests.
- **Lucide React**: A collection of beautiful and accessible icons.
- **React Hook Form**: For efficient form validation and management.
- **Lodash Debounce**: To optimize performance on inputs.

---

## ⚡ Getting Started

Follow these steps to get a local copy of the project up and running.

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) installed
- A package manager like **npm** or **yarn**

### 📥 Installation

Clone the repository:

```bash
git clone https://github.com/rajkishort596/Tanishq-clone.git
```

Navigate to the project directory:

```bash
cd admin
```

Install dependencies:

```bash
npm install
# or
yarn install
```

### ▶️ Running the Development Server

Start the development server with hot-reloading:

```bash
npm run dev
```

This will typically start the application at: [http://localhost:5173](http://localhost:5173)

### 📦 Building for Production

To create a production-ready build of the application:

```bash
npm run build
```

The output will be located in the `dist` directory. Deploy the contents of this folder to any static hosting service.

---

## 📂 Project Structure

```
/
├── public/                  # Public static assets
├── src/
│   ├── api/                 # API service files (e.g., API calls)
│   ├── app/                 # App-level configuration (store, providers, etc.)
│   ├── assets/              # Static assets like images, fonts, etc.
│   ├── components/          # Reusable UI components
│   ├── constants/           # Constant values and configuration files
│   ├── features/            # Feature-specific logic and state management
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Layout components (wrappers, templates)
│   ├── pages/               # Page components for routing
│   ├── utils/               # Utility/helper functions
│   ├── App.css              # Global styles
│   ├── App.jsx              # Main application component
│   ├── axios.js             # Axios instance configuration
│   ├── index.css            # Base/global CSS
│   └── main.jsx             # Entry point of the application
├── .env                     # Environment variables
├── .gitignore               # Git ignored files
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML template for React app
├── package-lock.json        # Auto-generated lock file for npm
├── package.json             # Project dependencies and scripts
├── vite.config.js           # Vite configuration
```

---

# Owner: **@Rajkishor Thakur**

- Description: This README serves as comprehensive documentation for the Tanishq clone Admin Panel, offering essential guidance for understanding and working with the project.
