import { PrismaClient } from "@prisma/client";
import { Router } from "express";
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

// Delete product by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // Ensure product ID is an integer
  if (isNaN(id)) {
    return res.status(400).json({ message: "Product ID must be an integer." });
  }

  try {
    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { product_id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Delete the product
    await prisma.product.delete({
      where: { product_id: parseInt(id) },
    });

    console.log(`Product with ID ${id} deleted successfully.`);
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);

    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res
        .status(500)
        .json({ message: `Prisma Error: ${error.message}` });
    }

    res.status(500).json({ message: "Error deleting product." });
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

  // Check if user is logged in
  console.log("Session during purchase:", req.session);
  if (!req.session.customer_id) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  // Validate cart is provided and has items
  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty." });
  }

  // Validate required fields
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
    // Convert credit_expire to a valid date object
    const creditExpireDate = convertCreditExpireToDate(credit_expire);

    // Create the purchase entry
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

    // Parse cart to get product IDs and quantities
    const productIds = cart.split(",").map((id) => parseInt(id.trim()));

    // Group products by product_id, count quantities
    const productQuantities = productIds.reduce((acc, productId) => {
      acc[productId] = (acc[productId] || 0) + 1;
      return acc;
    }, {});

    // Generate the PurchaseItem data with quantities for each product
    const purchaseItemsData = Object.keys(productQuantities).map(
      (productId) => ({
        purchase_id: purchase.purchase_id, // Link each item to the purchase
        product_id: parseInt(productId),
        quantity: productQuantities[productId], // The correct quantity for each product
      })
    );

    // Create purchase items
    await prisma.purchaseItem.createMany({
      data: purchaseItemsData,
    });

    console.log("Purchase and purchase items created successfully:", {
      purchase,
      purchaseItemsData,
    });

    res.status(201).json({
      message: "Purchase completed successfully!",
      purchase,
    });
  } catch (error) {
    console.error("Error completing purchase:", error);

    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({ message: `Prisma Error: ${error.message}` });
    }

    res.status(500).json({ message: "Error completing purchase." });
  }
});

export default router;

