require("dotenv").config();
// ^^^ need this since we are connecting to our DB here..

const connectDB = require("./db/connect");
const Product = require("./models/product");
const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany(); // ???
    await Product.create(jsonProducts);
    console.log("Success");
    process.exit(0); // exits process after successful execution
  } catch (error) {
    console.log(error);
    process.exit(1); // exit(1) is the failure code
  }
};

start();
