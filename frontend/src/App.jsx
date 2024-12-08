import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./ui/Nav";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://localhost:3200/api/users/getSession", {
          credentials: "include",
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <div>
      <Nav isLoggedIn={isLoggedIn} />
      <Outlet context={setIsLoggedIn} />
    </div>
  );
};

export default App;

