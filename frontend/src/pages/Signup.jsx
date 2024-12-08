import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3200/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Signup failed.");
      }

      alert("Signup successful! Redirecting to login page.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="Signup-Form">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="Signup-form-username">
          <label>Username</label>
          <input
            type="text"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <div className="Signup-form-email">
          <label>Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div className="Signup-form-password">
          <label>Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div className="Signup-form-FirstName">
          <label>First Name</label>
          <input
            type="text"
            {...register("first_name", { required: "First name is required" })}
          />
          {errors.first_name && <p>{errors.first_name.message}</p>}
        </div>
        <div className="Signup-form-LastName">
          <label>Last Name</label>
          <input
            type="text"
            {...register("last_name", { required: "Last name is required" })}
          />
          {errors.last_name && <p>{errors.last_name.message}</p>}
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;


