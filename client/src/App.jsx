import React from "react";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  Route,
  RouterProvider,
} from "react-router-dom";
import ClientLayout from "./layouts/ClientLayout";
import Home from "./pages/Home";
import AllJewellery from "./pages/AllJewellery";
import ProductDetails from "./pages/ProductDetails";
import BraceletsAndBangles from "./pages/BraceletsAndBangles";
import Earrings from "./pages/Earrings";
import Rings from "./pages/Rings";
import Necklaces from "./pages/Necklaces";
import Diamond from "./pages/Diamond";
import Gold from "./pages/Gold";
import Collections from "./pages/Collections/Collections";
import Collection from "./pages/Collections/Collection";
import SearchResults from "./pages/SearchResults";
import Cart from "./pages/Cart";
import { ToastContainer } from "react-toastify";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlists" element={<div>Wishlists</div>} />
          <Route path="shop/all-jewellery" element={<AllJewellery />} />
          <Route
            path="shop/all-jewellery/:subCategory"
            element={<AllJewellery />}
          />
          <Route
            path="shop/all-jewellery/product/:productId"
            element={<ProductDetails />}
          />
          <Route path="shop/gold" element={<Gold />} />
          <Route path="shop/gold/:subCategory" element={<Gold />} />
          <Route path="shop/diamond" element={<Diamond />} />
          <Route path="shop/diamond/:subCategory" element={<Diamond />} />
          <Route path="shop/rings" element={<Rings />} />
          <Route path="shop/rings/:subCategory" element={<Rings />} />
          <Route path="shop/earrings" element={<Earrings />} />
          <Route path="shop/earrings/:subCategory" element={<Earrings />} />
          <Route path="shop/necklaces" element={<Necklaces />} />
          <Route path="shop/necklaces/:subCategory" element={<Necklaces />} />
          <Route
            path="shop/bracelets-and-bangles"
            element={<BraceletsAndBangles />}
          />
          <Route
            path="shop/bracelets-and-bangles/:subCategory"
            element={<BraceletsAndBangles />}
          />
          <Route
            path="shop/:category/:subCategory?/product/:productId"
            element={<ProductDetails />}
          />
          <Route path="shop/collections" element={<Collections />} />

          {/* Collection Pages Routes */}
          <Route path="shop/:collection" element={<Collection />} />

          <Route
            path="shop/collections/:collection?/product/:productId"
            element={<ProductDetails />}
          />

          {/* Search Pages Routes */}
          <Route path="search/" element={<SearchResults />} />
          <Route path="shop/product/:productId" element={<ProductDetails />} />
        </Route>
      </>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        // transition={Bounce}
      />
    </>
  );
};

export default App;
