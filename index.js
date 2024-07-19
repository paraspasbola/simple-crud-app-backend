

const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const app = express();

const bodyParser = require("body-parser"); //1
const cors = require("cors");              //2

//bodyparser used for parsing request body  //3
app.use(bodyParser.urlencoded({ extended: false })); //4
app.use(bodyParser.json()); //5
app.use(cors()); //6

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({extended: false}));   // For Form


app.get("/", (req, res) => {
  res.send("Hello from node api server ggg");
});

// To get all api  -- Read
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });;
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// To get by product id  -- Read by Single Id
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;   // it will destucture id from data
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// For Post Product in Db  -- Create 
app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  // console.log(req.body);
  // res.send(req.body);
});

// update a product    -- Update
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body);

    if (!product) {
      return res.status(404).json({ message: "product not found!" });
    }

    const updatedProduct = await Product.findById(id);
    res.status(200).json({ updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product   -- Delete

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params; //it destructuring from req

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ messsage: "product not found!" });
    }

    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Database Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(() => {
    console.log("connected to database!");
    app.listen(3000, () => {
      console.log("Server is running on port http://localhost:3000");
    });
  })
  .catch(() => {
    console.log("connection failed!");
  });
