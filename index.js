require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));


const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number
});

const Product = mongoose.model("Product", productSchema);


app.get("/", (req, res) => {
  res.send("Product API is running successfully");
});


app.get("/products", async (req, res) => {
  try {
    const data = await Product.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({ message: "Product added successfully", product });
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

// required for vercel
module.exports = app;
