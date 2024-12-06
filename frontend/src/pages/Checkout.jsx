import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Checkout() {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    province: "",
    country: "",
    postal_code: "",
  });
  const [creditCard, setCreditCard] = useState({
    number: "",
    expire: "",
    cvv: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  //check if the user is logged in
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  //if the user is not logged in, display a message and redirect to login
  if (!isLoggedIn) {
    return (
      <div>
        <p>You must be logged in to proceed to checkout.</p>
        <Link to="/login" state={{ from: "/checkout" }}>
          Login
        </Link>
      </div>
    );
  }

  //handle input field changes for address and credit card fields
  const handleInputChange = (e, field, stateSetter) => {
    stateSetter((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  //handle the purchase logic when the form is submitted
  const handlePurchase = async (e) => {
    e.preventDefault();
    const cart = Cookies.get("cart");
    if (!cart) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    const productIds = cart.split(",");
    try {
      const response = await fetch(
        "http://localhost:3200/api/products/purchase",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", //ensures session cookies are sent with request
          body: JSON.stringify({
            address,
            creditCard,
            productIds,
          }),
        }
      );

      if (response.ok) {
        Cookies.remove("cart"); //clear cart
        navigate("/confirmation");
      } else {
        const result = await response.json();
        setErrorMessage(result.message || "Failed to complete purchase.");
      }
    } catch (error) {
      console.error("Error processing purchase:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handlePurchase}>
        <div>
          <label>Street:</label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => handleInputChange(e, "street", setAddress)}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => handleInputChange(e, "city", setAddress)}
            required
          />
        </div>
        <div>
          <label>Province:</label>
          <input
            type="text"
            value={address.province}
            onChange={(e) => handleInputChange(e, "province", setAddress)}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            value={address.country}
            onChange={(e) => handleInputChange(e, "country", setAddress)}
            required
          />
        </div>
        <div>
          <label>Postal Code:</label>
          <input
            type="text"
            value={address.postal_code}
            onChange={(e) => handleInputChange(e, "postal_code", setAddress)}
            required
          />
        </div>

        <div>
          <label>Credit Card Number:</label>
          <input
            type="tel"
            value={creditCard.number}
            onChange={(e) => handleInputChange(e, "number", setCreditCard)}
            required
          />
        </div>
        <div>
          <label>Expiration Date:</label>
          <input
            type="text"
            value={creditCard.expire}
            onChange={(e) => handleInputChange(e, "expire", setCreditCard)}
            required
          />
        </div>
        <div>
          <label>CVV:</label>
          <input
            type="tel"
            value={creditCard.cvv}
            onChange={(e) => handleInputChange(e, "cvv", setCreditCard)}
            required
          />
        </div>

        <button type="submit">Confirm</button>
      </form>
    </div>
  );
}

export default Checkout;
