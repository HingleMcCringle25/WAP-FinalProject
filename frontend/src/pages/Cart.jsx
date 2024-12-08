import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const taxRate = 0.15;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartCookie = Cookies.get("cart");
        if (!cartCookie) {
          setCartItems([]);
          return;
        }

        const productIds = cartCookie.split(",");
        const productCounts = productIds.reduce((acc, id) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {});

        const uniqueIds = [...new Set(productIds)];
        const productPromises = uniqueIds.map((id) =>
          fetch(`http://localhost:3200/api/products/${id}`, {
            credentials: "include",
          }).then((res) => res.json())
        );

        const products = await Promise.all(productPromises);

        const items = products.map((product) => ({
          ...product,
          quantity: productCounts[product.product_id],
        }));

        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return; 

    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    
    const cartCookie = Cookies.get("cart");
    const productIds = cartCookie.split(",");
    const updatedCart = productIds
      .filter((id) => id !== productId.toString())
      .concat(Array(newQuantity).fill(productId.toString()));
    Cookies.set("cart", updatedCart.join(","), { expires: 7 });
  };

  const handleRemoveFromCart = (productId) => {
    
    const cartCookie = Cookies.get("cart");
    if (!cartCookie) return;

    
    const productIds = cartCookie.split(",");
    const updatedCart = productIds.filter((id) => id !== productId.toString());
    Cookies.set("cart", updatedCart.join(","), { expires: 7 });

    
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product_id !== productId)
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.cost * item.quantity,
    0
  );
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="Your-Cart">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product_id} className="cart-item">
                <img
                  src={`http://localhost:3200/public/images/${item.image_filename}`}
                  alt={item.name}
                  style={{ maxWidth: "100px" }}
                />
                <div className="cart-details">
                  <h2>{item.name}</h2>
                  <p>Price: ${item.cost.toFixed(2)}</p>
                  <div className="quantity-control">
                    Quantity:
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product_id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      min="1"
                    />
                    
                  </div>
                  <p>Item Total: ${(item.cost * item.quantity).toFixed(2)}</p>
                  <button onClick={() => handleRemoveFromCart(item.product_id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Sub-total: ${subtotal.toFixed(2)}</h3>
            <h3>Tax: ${tax.toFixed(2)}</h3>
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
          <div className="cart-actions">
            <button onClick={() => navigate("/")}>Continue Shopping</button>
            <button onClick={() => navigate("/checkout")}>
              Go to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;





