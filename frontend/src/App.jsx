import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Nav from "./ui/Nav";

function App() {
  // Initialize isLoggedIn from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    // Update localStorage whenever isLoggedIn changes
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  console.log("isLoggedIn:", isLoggedIn);

  return (
    <CartProvider>
      <div>
        <Nav isLoggedIn={isLoggedIn} />
        <Outlet context={setIsLoggedIn} />
      </div>
    </CartProvider>
  );
}

export default App;
