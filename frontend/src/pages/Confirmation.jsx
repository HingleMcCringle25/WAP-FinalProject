import { useNavigate } from "react-router-dom";

function Confirmation() {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    // Navigate to the home page
    navigate("/home");
  };

  return (
    <div>
      <h2>Thank you for your purchase!</h2>
      <p>
        Your purchase was successful. We hope you enjoy your new cards. Happy
        Collecting!
      </p>
      <button onClick={handleContinueShopping}>Continue Shopping</button>
    </div>
  );
}

export default Confirmation;
