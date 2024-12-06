import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();

  // Initialize useForm hook with validation rules
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // On successful form submission, send data to the backend
  const onSubmit = async (data) => {
    try {
      // Send the form data to the backend API (POST request)
      const response = await fetch("http://localhost:3200/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Send the form data as JSON
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect to Login page after successful signup
        navigate("/login");
      } else {
        // Show error message if signup fails
        alert(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
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

        {/* Username Input */}
        <div>
          <label>Username:</label>
          <input
            type="text"
            {...register("username", { required: "Username is required" })}
            placeholder="Enter your username"
          />
          {errors.username && <p>{errors.username.message}</p>}
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

        {/* First Name Input */}
        <div>
          <label>First Name:</label>
          <input
            type="text"
            {...register("first_name", { required: "First Name is required" })}
            placeholder="Enter your first name"
          />
          {errors.first_name && <p>{errors.first_name.message}</p>}
        </div>

        {/* Last Name Input */}
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            {...register("last_name", { required: "Last Name is required" })}
            placeholder="Enter your last name"
          />
          {errors.last_name && <p>{errors.last_name.message}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>

      {/* Link to Login page */}
      <div>
        <p>
          Already have an account? <a href="/login">Log in.</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
