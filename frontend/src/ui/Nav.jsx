import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Nav = ({ isLoggedIn }) => {
  const [cartCount, setCartCount] = useState(0);

  
  const calculateCartCount = () => {
    const cart = Cookies.get("cart");
    if (cart) {
      const items = cart.split(",").filter(Boolean);
      setCartCount(items.length);
    } else {
      setCartCount(0);
    }
  };

  
  useEffect(() => {
    calculateCartCount();
  }, []);
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/cart">
            <FaShoppingCart />
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>
        </li>
        {isLoggedIn ? (
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;



