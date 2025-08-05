import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromChildren,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Layout
import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Login from "./pages/Login.jsx";
import Category from "./pages/Category/Category.jsx";
import CategoryForm from "./pages/Category/CategoryForm.jsx";
import Collection from "./pages/Collection/Collection.jsx";
import CollectionForm from "./pages/Collection/CollectionForm.jsx";
import Product from "./pages/Product/Product.jsx";
import ProductForm from "./pages/Product/ProductForm.jsx";

function App() {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Category />} />
          <Route path="categories/new" element={<CategoryForm />} />
          <Route
            path="categories/edit/:categoryId"
            element={<CategoryForm />}
          />
          <Route path="collections" element={<Collection />} />
          <Route path="collections/new" element={<CollectionForm />} />
          <Route
            path="collections/edit/:collectionId"
            element={<CollectionForm />}
          />
          <Route path="products" element={<Product />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:productId" element={<ProductForm />} />
          <Route path="orders" element={<div>Orders</div>} />
          <Route path="banners" element={<div>Banners</div>} />
          <Route path="reviews" element={<div>Reviews</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
