require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number
});

const Product = mongoose.model("Product", productSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
});

app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get("/product/:id", async (req, res) => {
  const product = await Product.findOne({ id: req.params.id });
  if (!product) return res.json({ message: "Product not found" });
  res.json(product);
});

app.post("/product", async (req, res) => {
  const newProduct = {
    id: Number(req.body.id),
    name: req.body.name,
    price: Number(req.body.price)
  };
  await Product.create(newProduct);
  res.send("Product added successfully");
});

app.put("/product/:id", async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );
  if (!product) return res.json({ message: "Product not found" });
  res.json(product);
});

app.delete("/product/:id", async (req, res) => {
  const product = await Product.findOneAndDelete({ id: req.params.id });
  if (!product) return res.json({ message: "Product not found" });
  res.json({ message: "Product deleted successfully" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
