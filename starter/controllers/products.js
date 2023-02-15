const Product = require("../models/product");

// getAllProductsStatic (HARD CODED)======================================================
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort("-name price");
  res.status(200).json({ products, nbHits: products.length });
};

// getAllProducts (DYNAMIC)=================================================================
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort } = req.query;
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
  // ^^^ $regex: provides regular expression capabilities for pattern matching strings in queries.
  // $options: "i" = case insensitive
  // reference mongoDB query operators for more info.

  console.log(queryObject);

  let result = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    console.log(sortList);
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  const products = await result;

  res.status(200).json({ products, nbHits: products.length });
};

// EXPORTS===============================================================================
module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
