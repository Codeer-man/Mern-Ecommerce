import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "../ui/button";
import React from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function AdminProductTile({
  product,
  setCurrentEditedId,
  setOpenCreateProductsDialoge,
  setFormData,
  handleDelete,
  handleToggleList,
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <div>
        <div className="relative">
          <img
            src={product.image[0].url}
            alt={product.title}
            className="w-full h-[300px] object-contain rounded-t-lg"
          />
        </div>

        <div className="px-6 font-bold mt-2 text-sm">
          Status:{" "}
          <span className={product.list ? "text-green-600" : "text-red-600"}>
            {product.list ? "Listed" : "Unlisted"}
          </span>
        </div>

        <CardContent>
          <h2 className="text-lg font-bold mb-2">{product.title}</h2>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    className={"cursor-pointer flex items-center"}
                    onClick={() => {
                      setOpenCreateProductsDialoge(true);
                      setCurrentEditedId(product._id);
                      setFormData(product);
                    }}
                  >
                    <FaEdit />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    className={"cursor-pointer"}
                    variant="destructive"
                    onClick={() => handleDelete(product._id)}
                  >
                    <MdDelete />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <h3>Delete</h3>
              </TooltipContent>
            </Tooltip>
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
