import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setIsLoggedIn = useOutletContext(); // Access setIsLoggedIn function

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3200/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setIsLoggedIn(true); // Set isLoggedIn to true on successful login
        localStorage.setItem("isLoggedIn", "true");

        const redirectPath = location.state?.from?.pathname || "/home";
        navigate(redirectPath);
      } else {
        alert(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Input */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Enter your email"
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        {/* Password Input */}
        <div>
          <label>Password:</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Enter your password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit">Log In</button>
        </div>
      </form>

      <div>
        <p>
          Don't have an account? <a href="/signup">Sign up.</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
