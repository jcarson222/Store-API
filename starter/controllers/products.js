const Product = require("../models/product");

// getAllProductsStatic (HARD CODED)======================================================
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).select("name price").limit(3).skip(2);
  res.status(200).json({ products, nbHits: products.length });
};

// getAllProducts (DYNAMIC)=================================================================
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields } = req.query;
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

  // SORT
  // ^^^ Sets the sort order
  if (sort) {
    const sortList = sort.split(",").join(" ");
    //console.log(sortList);
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  // SELECT FIELDS
  // ^^^ Specifies which document fields to include or exclude
  if (fields) {
    const fieldList = fields.split(",").join(" ");
    //console.log(fieldList);
    result = result.select(fieldList);
  }

  // LIMIT/SKIP
  // ^^^ limit: Specifies the maximum number of documents the query will return.
  // ^^^ skip: Specifies the number of documents to skip.
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;

  res.status(200).json({ products, nbHits: products.length });
};

// EXPORTS===============================================================================
module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
