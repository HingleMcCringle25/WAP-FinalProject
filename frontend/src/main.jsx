import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import Router components
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Details from "./pages/Details.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Confirmation from "./pages/Confirmation.jsx";

// Set up routes and wrap the app in BrowserRouter
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Parent route with 'App' component */}
        <Route path="/" element={<App />}>
          {/* Child routes */}
          <Route index element={<Home />} />
          <Route path="details/:id" element={<Details />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="confirmation" element={<Confirmation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);