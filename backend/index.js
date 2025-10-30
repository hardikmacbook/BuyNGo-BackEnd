import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const app = express();
app.use(express.json());
app.use(cors());

// Helper function to clean and validate data
const cleanData = (data, model) => {
  const cleaned = { ...data };

  // Remove id field as MongoDB generates it
  delete cleaned.id;

  // Model-specific data cleaning
  if (model === "review") {
    // Ensure rating is a number
    if (cleaned.rating !== undefined) {
      cleaned.rating = Number(cleaned.rating);
    }
    // Ensure verified is boolean
    if (cleaned.verified !== undefined) {
      cleaned.verified =
        cleaned.verified === true || cleaned.verified === "true";
    }
  }

  if (model === "products") {
    // Ensure numeric fields are numbers
    if (cleaned.price !== undefined) cleaned.price = Number(cleaned.price);
    if (cleaned.special_price !== undefined)
      cleaned.special_price = Number(cleaned.special_price);
    if (cleaned.stock_quantity !== undefined)
      cleaned.stock_quantity = Number(cleaned.stock_quantity);
    // Ensure images is an array
    if (cleaned.images && !Array.isArray(cleaned.images)) {
      cleaned.images = [cleaned.images];
    }
  }

  return cleaned;
};

// GET endpoints
app.get("/review", async (req, res) => {
  try {
    const items = await prisma.review.findMany();
    res.json(items);
  } catch (e) {
    console.error("Error fetching reviews:", e);
    res
      .status(500)
      .json({ error: "Failed to fetch reviews", details: e.message });
  }
});

app.get("/core-values", async (req, res) => {
  try {
    const items = await prisma.core_value.findMany();
    res.json(items);
  } catch (e) {
    console.error("Error fetching core values:", e);
    res
      .status(500)
      .json({ error: "Failed to fetch core values", details: e.message });
  }
});

app.get("/hero-slider", async (req, res) => {
  try {
    const items = await prisma.hero_slider.findMany();
    res.json(items);
  } catch (e) {
    console.error("Error fetching hero slider:", e);
    res
      .status(500)
      .json({ error: "Failed to fetch hero slider", details: e.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const items = await prisma.products.findMany();
    res.json(items);
  } catch (e) {
    console.error("Error fetching products:", e);
    res
      .status(500)
      .json({ error: "Failed to fetch products", details: e.message });
  }
});

// --- Core Values CRUD ---
app.post("/core-values", async (req, res) => {
  try {
    const data = cleanData(req.body, "core_value");
    console.log("Creating core value with data:", data);

    // Validate required fields
    if (!data.title || !data.description) {
      return res.status(400).json({
        error: "Missing required fields",
        details: "title and description are required",
      });
    }

    const created = await prisma.core_value.create({ data });
    res.status(201).json(created);
  } catch (e) {
    console.error("Core value creation error:", e);
    res.status(400).json({
      error: "Failed to create core value",
      details: e.message,
    });
  }
});

app.put("/core-values/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = cleanData(req.body, "core_value");
    console.log(`Updating core value ${id} with data:`, data);

    const updated = await prisma.core_value.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (e) {
    console.error(`Core value update error for ID ${id}:`, e);
    res.status(400).json({
      error: "Failed to update core value",
      details: e.message,
    });
  }
});

app.delete("/core-values/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.core_value.delete({ where: { id } });
    res.json(deleted);
  } catch (e) {
    console.error("Core value deletion error:", e);
    res.status(400).json({
      error: "Failed to delete core value",
      details: e.message,
    });
  }
});

// --- Hero Slider CRUD ---
app.post("/hero-slider", async (req, res) => {
  try {
    const data = cleanData(req.body, "hero_slider");
    console.log("Creating slider item with data:", data);

    // Validate required fields
    if (!data.type || !data.url) {
      return res.status(400).json({
        error: "Missing required fields",
        details: "type and url are required",
      });
    }

    const created = await prisma.hero_slider.create({ data });
    res.status(201).json(created);
  } catch (e) {
    console.error("Slider item creation error:", e);
    res.status(400).json({
      error: "Failed to create slider item",
      details: e.message,
    });
  }
});

app.put("/hero-slider/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = cleanData(req.body, "hero_slider");
    console.log(`Updating slider item ${id} with data:`, data);

    const updated = await prisma.hero_slider.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (e) {
    console.error(`Slider item update error for ID ${id}:`, e);
    res.status(400).json({
      error: "Failed to update slider item",
      details: e.message,
    });
  }
});

app.delete("/hero-slider/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.hero_slider.delete({ where: { id } });
    res.json(deleted);
  } catch (e) {
    console.error("Slider item deletion error:", e);
    res.status(400).json({
      error: "Failed to delete slider item",
      details: e.message,
    });
  }
});

// --- Products CRUD ---
app.post("/products", async (req, res) => {
  try {
    const data = cleanData(req.body, "products");
    console.log("Creating product with data:", data);

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "category",
      "brand",
      "sku",
      "price",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        details: `Required: ${missingFields.join(", ")}`,
      }); 
    }
    data.product_id = Date.now();
    const created = await prisma.products.create({ data });
    res.status(201).json(created);
  } catch (e) {
    console.error("Product creation error:", e);
    res.status(400).json({
      error: "Failed to create product",
      details: e.message,
    });
  }
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = cleanData(req.body, "products");
    console.log(`Updating product ${id} with data:`, data);

    const updated = await prisma.products.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (e) {
    console.error(`Product update error for ID ${id}:`, e);
    res.status(400).json({
      error: "Failed to update product",
      details: e.message,
    });
  }
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.products.delete({ where: { id } });
    res.json(deleted);
  } catch (e) {
    console.error("Product deletion error:", e);
    res.status(400).json({
      error: "Failed to delete product",
      details: e.message,
    });
  }
});

// --- Reviews CRUD ---
app.post("/review", async (req, res) => {
  try {
    const data = cleanData(req.body, "review");
    console.log("Creating review with data:", data);

    // Validate required fields
    const requiredFields = [
      "name",
      "date",
      "review",
      "rating",
      "verified",
      "avatar",
    ];
    const missingFields = requiredFields.filter(
      (field) => data[field] === undefined
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        details: `Required: ${missingFields.join(", ")}`,
      });
    }

    // Validate rating range
    if (data.rating < 1 || data.rating > 5) {
      return res.status(400).json({
        error: "Invalid rating",
        details: "Rating must be between 1 and 5",
      });
    }

    const created = await prisma.review.create({ data });
    res.status(201).json(created);
  } catch (e) {
    console.error("Review creation error:", e);
    res.status(400).json({
      error: "Failed to create review",
      details: e.message,
    });
  }
});

app.put("/review/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = cleanData(req.body, "review");
    console.log(`Updating review ${id} with data:`, data);

    // Validate rating range if provided
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      return res.status(400).json({
        error: "Invalid rating",
        details: "Rating must be between 1 and 5",
      });
    }

    const updated = await prisma.review.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (e) {
    console.error(`Review update error for ID ${id}:`, e);
    res.status(400).json({
      error: "Failed to update review",
      details: e.message,
    });
  }
});

app.delete("/review/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.review.delete({ where: { id } });
    res.json(deleted);
  } catch (e) {
    console.error("Review deletion error:", e);
    res.status(400).json({
      error: "Failed to delete review",
      details: e.message,
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET    /review`);
  console.log(`   GET    /core-values`);
  console.log(`   GET    /hero-slider`);
  console.log(`   GET    /products`);
  console.log(`   POST   /review, /core-values, /hero-slider, /products`);
  console.log(
    `   PUT    /review/:id, /core-values/:id, /hero-slider/:id, /products/:id`
  );
  console.log(
    `   DELETE /review/:id, /core-values/:id, /hero-slider/:id, /products/:id`
  );
});
