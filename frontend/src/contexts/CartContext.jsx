import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = Cookies.get("cart");
    if (cart) {
      const productIds = cart.split(",");
      setCartItems(productIds);
    }
  }, []);

  const addToCart = (productId) => {
    const updatedCartItems = [...cartItems, productId];
    setCartItems(updatedCartItems);
    Cookies.set("cart", updatedCartItems.join(","));
  };

  const removeFromCart = (productId) => {
    const updatedCartItems = cartItems.filter((item) => item !== productId);
    setCartItems(updatedCartItems);
    Cookies.set("cart", updatedCartItems.join(","));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        cartItemCount: cartItems.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartContext;
