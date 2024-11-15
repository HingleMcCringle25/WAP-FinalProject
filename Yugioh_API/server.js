import express from "express";
import cors from "cors";
import session from "express-session";
import usersRouter from "./routes/users.js";

const port = process.env.PORT || 3200;
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//cors middleware
app.use(
  cors({
    origin: "http://localhost:5173", // react client
    credentials: true, // allow cookies
  })
);

//routes
app.use("/api/users", usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
