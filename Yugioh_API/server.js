import express from "express";
import cors from "cors";
import session from "express-session";
import usersRouter from "./routes/users.js";
import insertProductsRouter from "./routes/insertProducts.js";
import productsRouter from "./routes/products.js";

const port = process.env.PORT || 3200;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
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
