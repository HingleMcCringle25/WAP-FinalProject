// routes/product.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = Router();

// POST: Insert a single product
router.post("/", async (req, res) => {
  const {
    name,
    description,
    cost,
    image_filename,
    rarity,
    condition,
    serialNumber,
    edition,
    stockQuantity,
  } = req.body;

  // Validate input
  if (
    !name ||
    !description ||
    !cost ||
    !image_filename ||
    !rarity ||
    !condition ||
    !serialNumber ||
    !edition ||
    !stockQuantity
  ) {
    return res.status(400).json({ message: "All fields must be provided" });
  }

  try {
    // Create the product entry
    const product = await prisma.product.create({
      data: {
        name,
        description,
        cost: parseFloat(cost),
        image_filename,
        rarity,
        condition,
        serialNumber,
        edition,
        stockQuantity,
      },
    });

    res.status(201).json({
      message: "Product inserted successfully!",
      product,
    });
  } catch (error) {
    console.error("Error inserting product:", error);
    res.status(500).json({ message: "Error inserting product." });
  }
});

export default router;
