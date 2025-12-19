require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number
});

const Product = mongoose.model("Product", productSchema);

// Show form by default
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/form.html");
});

// GET all products
app.get("/products", async (req, res) => {
  try {
    const data = await Product.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET product by id
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST product (form retrieves data)
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.send("Product Added Successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update product
app.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!product) return res.json({ message: "Product not found" });

    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product
app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

module.exports = app;
