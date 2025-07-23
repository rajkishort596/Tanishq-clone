import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromChildren,
  RouterProvider,
} from "react-router-dom";

// Layout
import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        <Route path="/login" element={<div>Login</div>} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<div>Category</div>} />
          <Route path="collections" element={<div>Collections</div>} />
          <Route path="products" element={<div>Products</div>} />
          <Route path="orders" element={<div>Orders</div>} />
          <Route path="banners" element={<div>Banners</div>} />
          <Route path="reviews" element={<div>Reviews</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
