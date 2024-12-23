import cors from "cors";
import express from "express";
import session from "express-session";
import insertProductsRouter from "./routes/insertProducts.js";
import productsRouter from "./routes/products.js";
import usersRouter from "./routes/users.js";

const port = process.env.PORT || 3200;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, //set to false, HTTPS would have this set to true
      maxAge: 3600000,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

//routes
app.get("/", (req, res) => {
  res.send("Server is working!");
});
app.use("/api/users", usersRouter);
app.use("/api/insert-products", insertProductsRouter);
app.use("/api/products", productsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
