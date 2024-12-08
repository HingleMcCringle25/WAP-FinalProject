import React from "react";
import { useNavigate } from "react-router-dom";

const Confirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="confirmation">
      <h1>Thank You for Your Purchase!</h1>
      <p>Your order has been placed successfully.</p>
      <button onClick={() => navigate("/")}>Continue Shopping</button>
    </div>
  );
};

export default Confirmation;


