import mongoose from "mongoose";

const URL =
  "mongodb+srv://mdrmoney34:mdrmoney34@cluster0.klkq8ku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

import Product from "../model/Product";

export const connectdb = async () => {
  if (!URL) {
    return console.error("Url not working ");
  }
  try {
    await mongoose.connect(URL);
    console.log("Databse connected");

    // const update = await Product.updateMany(
    //   { list: { $exists: false } },
    //   { $set: { list: true } }
    // )
    //   .then(() => console.log("list added"))
    //   .catch((err) => console.log("something error", err));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// const seedDB = async () => {
// await Product.deleteMany();
//   await Product.insertMany(seedProducts);
//   console.log("Products added");
//   mongoose.disconnect();
// };

// seedDB();
