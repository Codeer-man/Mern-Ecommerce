import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "../ui/button";
import React from "react";


export default function AdminProductTile({
  product,
  setCurrentEditedId,
  setOpenCreateProductsDialoge,
  setFormData,
  handleDelete,
  handleToggleList,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>

        <div className="px-6 font-bold mt-2 text-sm">
          Status:{" "}
          <span className={product.list ? "text-green-600" : "text-red-600"}>
            {product.list ? "Listed" : "Unlisted"}
          </span>
        </div>

        <CardContent>
          <h2 className="text-xl font-bold mb-2">{product.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-bold">${product?.salePrice}</span>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 md:flex-row justify-between items-center px-4">
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setOpenCreateProductsDialoge(true);
                setCurrentEditedId(product._id);
                setFormData(product);
              }}
            >
              Edit
            </Button>

            <Button
              variant="destructive"
              onClick={() => handleDelete(product._id)}
            >
              Delete
            </Button>
          </div>

          <Button
            className={"cursor-pointer"}
            variant={product.list ? "secondary" : "default"}
            onClick={() => handleToggleList(product)}
          >
            {product.list ? "Unlist" : "List"}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
