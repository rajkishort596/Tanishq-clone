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

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<div>Cart</div>} />
          <Route path="wishlists" element={<div>Wishlists</div>} />
          <Route path="shop/all-jewellery" element={<AllJewellery />} />
          <Route path="shop/gold" element={<div>Gold Jewellery</div>} />
          <Route path="shop/diamond" element={<div>Diamond Jewellery</div>} />
          <Route path="shop/rings" element={<div>Rings</div>} />
          <Route path="shop/earrings" element={<div>Earrings</div>} />
          <Route path="shop/necklaces" element={<div>Necklaces</div>} />
          <Route
            path="shop/bracelets-and-bangles"
            element={<div>Bracelets & Bangles</div>}
          />
          <Route path="shop/collections" element={<div>Collections</div>} />
        </Route>
      </>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
