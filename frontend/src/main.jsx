import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx"; // App component for routing
import Home from "./pages/Home.jsx";
import Details from "./pages/Details.jsx";
import Signup from "./pages/Signup.jsx"; // Signup page
import Login from "./pages/Login.jsx"; // Login page
import Logout from "./pages/Logout.jsx"; // Logout page
import Cart from "./pages/Cart.jsx"; // Cart page
import Checkout from "./pages/Checkout.jsx"; // Checkout page
import Confirmation from "./pages/Confirmation.jsx"; // Confirmation page

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Direct route for Signup page */}
        <Route path="/" element={<Signup />} />{" "}
        {/* The root route will now directly show the Signup page */}
        {/* Other routes wrapped in App */}
        <Route path="/" element={<App />}>
          <Route path="home" element={<Home />} />
          <Route path="details/:id" element={<Details />} />
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
