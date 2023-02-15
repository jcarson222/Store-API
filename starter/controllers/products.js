const Product = require("../models/product");

// getAllProductsStatic (HARD CODED)======================================================
const getAllProductsStatic = async (req, res) => {
  const search = "al";

  const products = await Product.find({
    name: { $regex: search, $options: "i" },
    // $regex: provides regular expression capabilities for pattern matching strings in queries.
    // $options: "i" = case insensitive
    // reference mongoDB query operators for more info.
  });
  res.status(200).json({ products, nbHits: products.length });
};

// getAllProducts (DYNAMIC)=================================================================
const getAllProducts = async (req, res) => {
  const { featured, company, name } = req.query;
  // ^^^ the key(s) that we're specifically looking for in the req.query

  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  // ^^^ IF the key(featured) exists, we set up a new property on the new queryObject (called featured).
  // This new property has some functionality (the req.query will return a string, we want boolean). Here we used a ternary operator.
  // ^^^ if (featured === 'true'){ return products featured: true } else { return products featured: false }
  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  console.log(queryObject);

  const products = await Product.find(queryObject);

  res.status(200).json({ products, nbHits: products.length });
};

// EXPORTS===============================================================================
module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
