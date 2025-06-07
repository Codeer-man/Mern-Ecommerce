import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";

export default function ShopingProduct({
  product,
  handleGetProductDetail,
  handleAddToCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetail(product._id)}>
        <div className="relative">
          <img
            src={product.image[0].url}
            alt={product.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product.totalStock === 0 ? (
            <Badge className={"absolute top-2 right-2"}>Out Od Stock</Badge>
          ) : product.totalStock <= 10 ? (
            <Badge
              className={"absolute top-2 right-2"}
            >{`Only ${product.totalStock} items left`}</Badge>
          ) : null}
          {product.salePrice > 0 ? (
            <Badge
              className={"absolute top-2 left-2 bg-red-500 hover:bg-red-600"}
            >
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product.category]}
            </span>
            <span className="text-[16px] text-muted-foreground"></span>
            {brandOptionsMap[product.brand]}
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product.totalStock === 0 ? (
          <Button
            className={"w-full"}
            onClick={() => handleAddToCart(product._id)}
            disabled={product.totalStock === 0}
          >
            Out of stock
          </Button>
        ) : (
          <Button
            className={"w-full"}
            onClick={() => handleAddToCart(product._id, product.totalStock)}
          >
            Add To Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
