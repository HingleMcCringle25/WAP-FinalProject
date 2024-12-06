import { useNavigate, useOutletContext } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const setIsLoggedIn = useOutletContext(); // Access setIsLoggedIn function

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3200/api/users/logout", {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok) {
        setIsLoggedIn(false); // Set isLoggedIn to false on successful logout
        localStorage.setItem("isLoggedIn", "false");
        navigate("/login");
      } else {
        alert(result.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout. Please try again.");
    }
  };

  return (
    <div>
      <h2>Logged Out</h2>
      <p>You have successfully logged out.</p>
      <button onClick={handleLogout}>Go to Login Page</button>
    </div>
  );
};

export default Logout;
