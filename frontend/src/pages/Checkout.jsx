import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const Checkout = () => {
  const setIsLoggedIn = useOutletContext();
  const [isLoggedIn, setIsLoggedInState] = useState(false);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    province: "",
    country: "",
    postal_code: "",
    credit_card: "",
    credit_expire: "",
    credit_cvv: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://localhost:3200/api/users/getSession", {
          credentials: "include",
        });

        if (!response.ok) {
          setIsLoggedInState(false);
          return;
        }

        setIsLoggedInState(true);
      } catch (error) {
        setIsLoggedInState(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cart = Cookies.get("cart");
      if (!cart) {
        alert("Your cart is empty.");
        return;
      }

      const response = await fetch("http://localhost:3200/api/products/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...formData, cart }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to complete the purchase.");
      }

      Cookies.remove("cart");
      alert("Purchase completed successfully!");
      navigate("/confirmation");
    } catch (error) {
      alert(error.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <div>
        <h1>Checkout</h1>
        <p>You must be logged in to proceed to checkout.</p>
        <p>
          <a href="/login">Click here to log in</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="checkout-street">
          <label>Street</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="checkout-city">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="checkout-province">
          <label>Province</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="checkout-country">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="checkout-postal">
          <label>Postal Code</label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="checkout-cardNumber">
          <label>Credit Card</label>
          <input
            type="text"
            name="credit_card"
            value={formData.credit_card}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="checkout-cardExpiry">
          <label>Expiry Date</label>
          <input
            type="text"
            name="credit_expire"
            placeholder="MM/YY"
            value={formData.credit_expire}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="checkout-crdCVV">
          <label>CVV</label>
          <input
            type="text"
            name="credit_cvv"
            value={formData.credit_cvv}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Complete Purchase</button>
      </form>
    </div>
  );
};

export default Checkout;


