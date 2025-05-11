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
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedProducts = [
  {
    title: "Air Jordan 2",
    description: "Top quality and stylish.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_1.jpg",
    category: "kids",
    brand: "adidas",
    price: 197,
    salePrice: 0,
    totalStock: 9,
  },
  {
    title: "Adidas Ultraboost",
    description: "Comfort meets performance.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_2.jpg",
    category: "women",
    brand: "zara",
    price: 236,
    salePrice: 0,
    totalStock: 7,
  },
  {
    title: "Puma Smash",
    description: "Modern design with classic touch.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_3.jpg",
    category: "footwear",
    brand: "levi",
    price: 105,
    salePrice: 157,
    totalStock: 24,
  },
  {
    title: "Levi's 511 Jeans",
    description: "Lightweight and breathable.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_4.jpg",
    category: "kids",
    brand: "nike",
    price: 178,
    salePrice: 0,
    totalStock: 35,
  },
  {
    title: "Zara Classic Shirt",
    description: "Your go-to item for any occasion.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_5.jpg",
    category: "kids",
    brand: "adidas",
    price: 407,
    salePrice: 0,
    totalStock: 21,
  },
  {
    title: "H&M Slim Fit Blazer",
    description: "Lightweight and breathable.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_6.jpg",
    category: "women",
    brand: "nike",
    price: 225,
    salePrice: 0,
    totalStock: 10,
  },
  {
    title: "Nike Air Max",
    description: "New season favorite.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_7.jpg",
    category: "accessories",
    brand: "puma",
    price: 409,
    salePrice: 107,
    totalStock: 44,
  },
  {
    title: "Adidas NMD",
    description: "Modern design with classic touch.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_8.jpg",
    category: "kids",
    brand: "puma",
    price: 496,
    salePrice: 66,
    totalStock: 19,
  },
  {
    title: "Puma Running Tee",
    description: "Lightweight and breathable.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_9.jpg",
    category: "women",
    brand: "zara",
    price: 349,
    salePrice: 148,
    totalStock: 31,
  },
  {
    title: "Levi's Trucker Jacket",
    description: "Modern design with classic touch.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_10.jpg",
    category: "women",
    brand: "nike",
    price: 485,
    salePrice: 51,
    totalStock: 6,
  },
  {
    title: "Zara Denim Skirt",
    description: "Designed for comfort and durability.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_11.jpg",
    category: "men",
    brand: "puma",
    price: 165,
    salePrice: 89,
    totalStock: 17,
  },
  {
    title: "H&M Hoodie",
    description: "Must-have for every wardrobe.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_12.jpg",
    category: "accessories",
    brand: "zara",
    price: 310,
    salePrice: 294,
    totalStock: 31,
  },
  {
    title: "Nike Revolution 6",
    description: "Designed for comfort and durability.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_13.jpg",
    category: "accessories",
    brand: "h&m",
    price: 287,
    salePrice: 277,
    totalStock: 20,
  },
  {
    title: "Adidas Gazelle",
    description: "Modern design with classic touch.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_14.jpg",
    category: "kids",
    brand: "nike",
    price: 243,
    salePrice: 56,
    totalStock: 49,
  },
  {
    title: "Puma Sports Bra",
    description: "Must-have for every wardrobe.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_15.jpg",
    category: "accessories",
    brand: "h&m",
    price: 347,
    salePrice: 150,
    totalStock: 27,
  },
  {
    title: "Levi's 501 Original",
    description: "Modern design with classic touch.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_16.jpg",
    category: "kids",
    brand: "nike",
    price: 334,
    salePrice: 0,
    totalStock: 27,
  },
  {
    title: "Zara Cropped Blazer",
    description: "Comfort meets performance.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_17.jpg",
    category: "kids",
    brand: "puma",
    price: 119,
    salePrice: 0,
    totalStock: 32,
  },
  {
    title: "H&M Joggers",
    description: "Your go-to item for any occasion.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_18.jpg",
    category: "women",
    brand: "h&m",
    price: 115,
    salePrice: 286,
    totalStock: 8,
  },
  {
    title: "Nike Dri-FIT Tee",
    description: "Modern design with classic touch.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_19.jpg",
    category: "footwear",
    brand: "levi",
    price: 319,
    salePrice: 285,
    totalStock: 7,
  },
  {
    title: "Adidas Track Pants",
    description: "Comfort meets performance.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_20.jpg",
    category: "footwear",
    brand: "h&m",
    price: 236,
    salePrice: 232,
    totalStock: 17,
  },
  {
    title: "Puma Slide Sandals",
    description: "Top quality and stylish.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_21.jpg",
    category: "footwear",
    brand: "zara",
    price: 211,
    salePrice: 289,
    totalStock: 31,
  },
  {
    title: "Levi's Sherpa Jacket",
    description: "Brand new and ready to rock.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_22.jpg",
    category: "kids",
    brand: "zara",
    price: 300,
    salePrice: 0,
    totalStock: 17,
  },
  {
    title: "Zara Knit Dress",
    description: "Comfort meets performance.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_23.jpg",
    category: "kids",
    brand: "nike",
    price: 140,
    salePrice: 263,
    totalStock: 46,
  },
  {
    title: "H&M Cargo Pants",
    description: "Your go-to item for any occasion.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_24.jpg",
    category: "women",
    brand: "adidas",
    price: 485,
    salePrice: 119,
    totalStock: 22,
  },
  {
    title: "Nike Court Vision",
    description: "Your go-to item for any occasion.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_25.jpg",
    category: "footwear",
    brand: "nike",
    price: 463,
    salePrice: 77,
    totalStock: 32,
  },
  {
    title: "Adidas Forum Low",
    description: "Your go-to item for any occasion.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_26.jpg",
    category: "men",
    brand: "zara",
    price: 224,
    salePrice: 149,
    totalStock: 2,
  },
  {
    title: "Puma Windbreaker",
    description: "Top quality and stylish.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_27.jpg",
    category: "men",
    brand: "h&m",
    price: 148,
    salePrice: 0,
    totalStock: 20,
  },
  {
    title: "Levi's Graphic Tee",
    description: "A perfect blend of fashion and function.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_28.jpg",
    category: "women",
    brand: "adidas",
    price: 351,
    salePrice: 0,
    totalStock: 19,
  },
  {
    title: "Zara Puffer Coat",
    description: "Modern design with classic touch.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_29.jpg",
    category: "kids",
    brand: "nike",
    price: 134,
    salePrice: 0,
    totalStock: 23,
  },
  {
    title: "H&M Ribbed Top",
    description: "Comfort meets performance.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_30.jpg",
    category: "men",
    brand: "levi",
    price: 145,
    salePrice: 216,
    totalStock: 6,
  },
  {
    title: "Nike Flex Runner",
    description: "A perfect blend of fashion and function.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_31.jpg",
    category: "men",
    brand: "levi",
    price: 370,
    salePrice: 216,
    totalStock: 16,
  },
  {
    title: "Adidas TERREX",
    description: "Lightweight and breathable.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_32.jpg",
    category: "men",
    brand: "adidas",
    price: 387,
    salePrice: 114,
    totalStock: 38,
  },
  {
    title: "Puma Yoga Pants",
    description: "New season favorite.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_33.jpg",
    category: "women",
    brand: "h&m",
    price: 212,
    salePrice: 94,
    totalStock: 29,
  },
  {
    title: "Levi's Denim Shorts",
    description: "Must-have for every wardrobe.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_34.jpg",
    category: "accessories",
    brand: "adidas",
    price: 300,
    salePrice: 282,
    totalStock: 9,
  },
  {
    title: "Zara Oversized Tee",
    description: "Must-have for every wardrobe.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_35.jpg",
    category: "footwear",
    brand: "zara",
    price: 402,
    salePrice: 129,
    totalStock: 13,
  },
  {
    title: "H&M V-neck Sweater",
    description: "New season favorite.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_36.jpg",
    category: "accessories",
    brand: "levi",
    price: 362,
    salePrice: 125,
    totalStock: 32,
  },
  {
    title: "Nike Zoom Fly",
    description: "Lightweight and breathable.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_37.jpg",
    category: "men",
    brand: "adidas",
    price: 238,
    salePrice: 0,
    totalStock: 46,
  },
  {
    title: "Adidas Predator",
    description: "New season favorite.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_38.jpg",
    category: "men",
    brand: "nike",
    price: 191,
    salePrice: 0,
    totalStock: 25,
  },
  {
    title: "Puma Golf Polo",
    description: "Modern design with classic touch.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_39.jpg",
    category: "accessories",
    brand: "nike",
    price: 127,
    salePrice: 0,
    totalStock: 33,
  },
  {
    title: "Levi's Western Shirt",
    description: "Designed for comfort and durability.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_40.jpg",
    category: "footwear",
    brand: "nike",
    price: 169,
    salePrice: 249,
    totalStock: 8,
  },
  {
    title: "Zara Suit Pants",
    description: "Brand new and ready to rock.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_41.jpg",
    category: "footwear",
    brand: "puma",
    price: 181,
    salePrice: 252,
    totalStock: 7,
  },
  {
    title: "H&M Denim Jacket",
    description: "Lightweight and breathable.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_42.jpg",
    category: "women",
    brand: "puma",
    price: 143,
    salePrice: 0,
    totalStock: 42,
  },
  {
    title: "Nike Metcon",
    description: "Lightweight and breathable.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_43.jpg",
    category: "footwear",
    brand: "nike",
    price: 388,
    salePrice: 204,
    totalStock: 40,
  },
  {
    title: "Adidas Samba",
    description: "Brand new and ready to rock.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_44.jpg",
    category: "women",
    brand: "adidas",
    price: 158,
    salePrice: 0,
    totalStock: 5,
  },
  {
    title: "Puma Tank Top",
    description: "New season favorite.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_45.jpg",
    category: "footwear",
    brand: "puma",
    price: 143,
    salePrice: 235,
    totalStock: 47,
  },
  {
    title: "Levi's Skinny Jeans",
    description: "Brand new and ready to rock.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_46.jpg",
    category: "kids",
    brand: "zara",
    price: 264,
    salePrice: 0,
    totalStock: 5,
  },
  {
    title: "Zara Pleated Skirt",
    description: "Top quality and stylish.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_47.jpg",
    category: "women",
    brand: "adidas",
    price: 465,
    salePrice: 0,
    totalStock: 35,
  },
  {
    title: "H&M Button-up Shirt",
    description: "Must-have for every wardrobe.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_48.jpg",
    category: "men",
    brand: "zara",
    price: 328,
    salePrice: 0,
    totalStock: 5,
  },
  {
    title: "Nike Waffle One",
    description: "New season favorite.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_49.jpg",
    category: "accessories",
    brand: "levi",
    price: 378,
    salePrice: 256,
    totalStock: 45,
  },
  {
    title: "Adidas Adilette",
    description: "Designed for comfort and durability.",
    image:
      "http://res.cloudinary.com/dl9gbuvju/image/upload/v1746888787/image_50.jpg",
    category: "kids",
    brand: "adidas",
    price: 148,
    salePrice: 71,
    totalStock: 0,
  },
];

// const seedDB = async () => {
//   // await Product.deleteMany();
//   await Product.insertMany(seedProducts);
//   console.log("Products added");
//   mongoose.disconnect();
// };

// seedDB();
