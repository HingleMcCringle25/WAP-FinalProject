import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = Router();

//get all products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

//get product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  //make sure product id is an integer
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Product ID has to be an Integer." });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { product_id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Error fetching product by ID." });
  }
});

//function to convert MM/YY to a valid date
const convertCreditExpireToDate = (credit_expire) => {
  const [month, year] = credit_expire.split("/");

  //prepend 20 to year to get 4-digit year
  const fullYear = `20${year}`;

  //create date object for first day of next month
  const date = new Date(fullYear, month, 0); //0 = January 11 = December

  return date;
};

//purchase route
router.post("/purchase", async (req, res) => {
  const {
    street,
    city,
    province,
    country,
    postal_code,
    credit_card,
    credit_expire,
    credit_cvv,
    cart,
  } = req.body;

  //check if user is logged in
  if (!req.session.customer_id) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  console.log("Session during purchase:", req.session);

  //validate cart is provided and has items
  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty." });
  }

  //validate required fields
  if (
    !street ||
    !city ||
    !province ||
    !country ||
    !postal_code ||
    !credit_card ||
    !credit_expire ||
    !credit_cvv
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    //convert credit_expire to a valid date object
    const creditExpireDate = convertCreditExpireToDate(credit_expire);

    //create the purchase entry
    const purchase = await prisma.purchase.create({
      data: {
        customer_id: req.session.customer_id,
        street,
        city,
        province,
        country,
        postal_code,
        credit_card,
        credit_expire: creditExpireDate,
        credit_cvv,
        order_date: new Date(),
      },
    });

    //parse cart to get product IDs and quantities
    const productIds = cart.split(",").map((id) => parseInt(id.trim()));

    //group products by product_id, count quantities
    const productQuantities = productIds.reduce((acc, productId) => {
      acc[productId] = (acc[productId] || 0) + 1;
      return acc;
    }, {});

    //generate the PurchaseItem data with quantities for each product
    const purchaseItemsData = Object.keys(productQuantities).map(
      (productId) => ({
        purchase_id: purchase.purchase_id, //link each item to the purchase
        product_id: parseInt(productId),
        quantity: productQuantities[productId], //the correct quantity for each product
      })
    );

    //create purchase items
    await prisma.purchaseItem.createMany({
      data: purchaseItemsData,
    });

    res.status(201).json({
      message: "Purchase completed successfully!",
      purchase,
    });
  } catch (error) {
    console.error("Error completing purchase:", error);
    res.status(500).json({ message: "Error completing purchase." });
  }
});

export default router;
