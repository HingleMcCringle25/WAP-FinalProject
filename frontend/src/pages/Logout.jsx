import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

const Logout = () => {
  const [message, setMessage] = useState("");
  const setIsLoggedIn = useOutletContext();
  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await fetch("http://localhost:3200/api/users/logout", {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || "Failed to log out.");
        }

        setMessage("You have been logged out successfully.");
        setIsLoggedIn(false); 
      } catch (error) {
        setMessage(error.message);
      }
    };

    logoutUser();
  }, [setIsLoggedIn]);

  return (
    <div className="logout">
      <h1>Logout</h1>
      <p>{message}</p>
      <div className="logout-links">
        <Link to="/login">Go to Login</Link>
        <br />
        <Link to="/">Go to Home</Link>
      </div>
    </div>
  );
};

export default Logout;





