"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var productSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    image: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
}, { timestamps: true });
var Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
