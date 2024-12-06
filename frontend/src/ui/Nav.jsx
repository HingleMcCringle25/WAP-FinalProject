import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext"; // Import the context
import { FaShoppingCart } from "react-icons/fa"; // Import shopping cart icon

function Nav({ isLoggedIn }) {
  const { cartItemCount } = useCart(); // Get cartItemCount from context

  return (
    <nav>
      <ul className="nav-list">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/cart">
            {/* Cart icon followed by text */}
            <FaShoppingCart /> Cart ({cartItemCount})
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
}

export default Nav;
