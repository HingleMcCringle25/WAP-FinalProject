import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
  
    const cart = Cookies.get("cart");
    if (cart) {
      const productIds = cart.split(",");
      fetchCartProducts(productIds);
    }
  }, []);

  const fetchCartProducts = async (productIds) => {
    const uniqueProductIds = [...new Set(productIds)];
    const fetchedProducts = [];

    for (let id of uniqueProductIds) {
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/api/products/${id}`
      );
      if (response.ok) {
        const product = await response.json();
        const productQuantity = productIds.filter((pid) => pid === id).length;
        fetchedProducts.push({ ...product, quantity: productQuantity });
      }
    }

    setCartItems(fetchedProducts);
  };

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.cost * item.quantity,
      0
    );
    setSubtotal(total);
  }, [cartItems]);

  const updateCartCookie = (updatedProductIds) => {
    Cookies.set("cart", updatedProductIds.join(","));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedCartItems = [...cartItems];
    const productIndex = updatedCartItems.findIndex(
      (item) => item.product_id === productId
    );
    if (productIndex !== -1) {
      updatedCartItems[productIndex].quantity = newQuantity;
    }
    const updatedProductIds = [];
    updatedCartItems.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        updatedProductIds.push(item.product_id);
      }
    });

    setCartItems(updatedCartItems);
    updateCartCookie(updatedProductIds);
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCartItems = cartItems.filter(
      (item) => item.product_id !== productId
    );
    const updatedProductIds = updatedCartItems.flatMap((item) =>
      Array(item.quantity).fill(item.product_id)
    );

    setCartItems(updatedCartItems);
    updateCartCookie(updatedProductIds);
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleCompletePurchase = () => {
    navigate("/checkout");
  };

  return (
    <div>
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((product) => (
            <div key={product.product_id} className="cart-item">
              <img
                src={`${import.meta.env.VITE_API_HOST}/public/images/${
                  product.image_filename
                }`}
                alt={product.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{product.name}</h3>
                <p>Price: ${product.cost}</p>

                <div className="quantity">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        product.product_id,
                        parseInt(e.target.value)
                      )
                    }
                    min="1"
                  />
                </div>

                <p>Total: ${(product.cost * product.quantity).toFixed(2)}</p>
                
                <button
                  onClick={() => handleRemoveFromCart(product.product_id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <div className="cart-actions">
            <button onClick={handleContinueShopping}>Continue Shopping</button>
            <button onClick={handleCompletePurchase}>Move to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
