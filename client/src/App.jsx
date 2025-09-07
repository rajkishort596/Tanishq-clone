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

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<div>Cart</div>} />
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
          <Route path="shop/gold" element={<div>Gold Jewellery</div>} />
          <Route path="shop/diamond" element={<div>Diamond Jewellery</div>} />
          <Route path="shop/rings" element={<Rings />} />
          <Route path="shop/rings/:subCategory" element={<Rings />} />
          <Route path="shop/earrings" element={<Earrings />} />
          <Route path="shop/earrings/:subCategory" element={<Earrings />} />
          <Route
            path="shop/:category/product/:productId"
            element={<ProductDetails />}
          />
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
          <Route path="shop/collections" element={<div>Collections</div>} />
        </Route>
      </>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
