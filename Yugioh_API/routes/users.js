import { Router } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import PasswordValidator from "password-validator";
const prisma = new PrismaClient();
const router = Router();

const passwordSchema = new PasswordValidator();

passwordSchema
  .is()
  .min(8)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces();

//get all users in database. For testing purposes
router.get("/all", async (req, res) => {
  try {
    const users = await prisma.customer.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// signup
router.post("/signup", async (req, res) => {
  const { email, username, password, first_name, last_name } = req.body;

  // Log incoming request data
  console.log("Received signup request with data:", req.body);

  // Ensure no fields are blank
  if (!email || !username || !password || !first_name || !last_name) {
    console.log("Missing required fields");
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate password
  if (!passwordSchema.validate(password)) {
    return res.status(400).json({
      message:
        "Password must be minimum 8 characters, one uppercase, one lowercase, one number, and no spaces",
    });
  }

  try {
    // Check for existing user by email
    const existingUserByEmail = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      console.log("Email already in use:", email);
      return res.status(400).json({ message: "Email is already in use." });
    }

    // Check for existing user by username
    const existingUserByUsername = await prisma.customer.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.customer.create({
      data: {
        email,
        username,
        password: hashedPassword,
        first_name,
        last_name,
      },
    });

    // Log the created user
    console.log("New user created:", newUser);

    // Send a JSON response with the user data
    const response = {
      message: "User created successfully.",
      user: {
        user_id: newUser.customer_id,
        email: newUser.email,
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
      },
    };

    console.log("Response being sent:", response);

    res.status(201).json(response); // Ensure the response is JSON
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Failed to create user." });
  }
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //validate
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    //look for user by email
    const user = await prisma.customer.findUnique({ where: { email } });

    //if user doesnt exist, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    //compare password with hashed password in database
    const passwordMatch = await bcrypt.compare(password, user.password);

    //if password doesnt match, return 401
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    //store user data session after login
    req.session.customer_id = user.customer_id;
    req.session.email = user.email;
    req.session.first_name = user.first_name;
    req.session.last_name = user.last_name;

    //if login successful, return email address
    res.status(200).json({ message: "Login successful", email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

//logout route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out." });
    }
    res.status(200).json({ message: "Logged out successfully." });
  });
});

//getsession route
router.get("/getSession", (req, res) => {
  if (req.session.customer_id) {
    return res.status(200).json({
      user_id: req.session.customer_id,
      email: req.session.email,
      first_name: req.session.first_name,
      last_name: req.session.last_name,
    });
  }
  res.status(401).json({ message: "Not Logged in" });
});

// DELETE user route. FOR TESTING PURPOSES
router.delete("/delete/:userId", async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL parameter

  try {
    // Check if the user exists in the database
    const existingUser = await prisma.customer.findUnique({
      where: { customer_id: parseInt(userId) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete the user from the database
    await prisma.customer.delete({
      where: { customer_id: parseInt(userId) },
    });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

export default router;
