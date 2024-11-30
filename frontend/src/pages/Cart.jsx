import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({}); // To store quantities for each product
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the cart from the cookie
    const cart = Cookies.get("cart");
    if (cart) {
      const productIds = cart.split(",");
      fetchCartProducts(productIds);
    }
  }, []);

  const fetchCartProducts = async (productIds) => {
    const uniqueProductIds = [...new Set(productIds)]; // Make sure product IDs are unique
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
    // Calculate the subtotal whenever the cart items change
    const total = cartItems.reduce(
      (sum, item) => sum + item.cost * item.quantity,
      0
    );
    setSubtotal(total);
  }, [cartItems]);

  const updateCartCookie = (updatedProductIds) => {
    // Update the cookie with the new product IDs list
    Cookies.set("cart", updatedProductIds.join(","));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    // Update the quantity and recalculate the cart
    const updatedCartItems = [...cartItems];
    const productIndex = updatedCartItems.findIndex(
      (item) => item.product_id === productId
    );
    if (productIndex !== -1) {
      updatedCartItems[productIndex].quantity = newQuantity;
    }

    // Update cookie with the new quantity
    const updatedProductIds = [];
    updatedCartItems.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        updatedProductIds.push(item.product_id);
      }
    });

    setCartItems(updatedCartItems);
    updateCartCookie(updatedProductIds); // Update the cookie
  };

  const handleRemoveFromCart = (productId) => {
    // Remove product from cart
    const updatedCartItems = cartItems.filter(
      (item) => item.product_id !== productId
    );

    // Rebuild product IDs list for the cookie
    const updatedProductIds = updatedCartItems.flatMap((item) =>
      Array(item.quantity).fill(item.product_id)
    );

    setCartItems(updatedCartItems);
    updateCartCookie(updatedProductIds); // Update the cookie
  };

  const handleContinueShopping = () => {
    navigate("/"); // Navigate back to the home page
  };

  const handleCompletePurchase = () => {
    navigate("/checkout"); // Navigate to the checkout page
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

                {/* Quantity update input */}
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

                {/* Remove from cart button */}
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
