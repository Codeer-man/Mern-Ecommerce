import React from "react";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchUserItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { setProductDetail } from "@/store/shop/product-slice";

export default function ProductDetail({ open, setOpen, productDetail }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleAddToCart(ProductId) {
    dispatch(
      addToCart({ userId: user._id, ProductId: ProductId, quantity: 1 })
    ).then((data) => {
      if (data.payload.success === true) {
        dispatch(fetchUserItems(user._id));
        toast.success("Product had been added");
      }
    });
  }

  function handleDialogueClose() {
    setOpen(false);
    dispatch(setProductDetail());
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogueClose}>
      {open && (
        <DialogTitle>
          <DialogContent
            className={
              "grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]"
            }
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={productDetail?.image}
                alt={productDetail?.title}
                width={600}
                height={600}
                className=" aspect-square w-full object-cover"
              />
            </div>
            <div>
              <div>
                <h1 className="text-3xl font-extrabold">
                  {productDetail?.title}
                </h1>
                <p className="text-muted-foreground text-2xl mb-5 mt-4">
                  {productDetail?.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p
                  className={`text-3xl font-bold  ${
                    productDetail.salePrice > 0
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  ${productDetail.price}
                </p>
                <p className="text-2xl font-bold ">
                  {productDetail.salePrice > 0 ? "$" : null}
                  {productDetail.salePrice > 0 ? productDetail.salePrice : null}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <span className="text-muted-foreground"> (4.5)</span>
              </div>
              <div className="mt-4 mb-5">
                <Button
                  onClick={() => handleAddToCart(productDetail._id)}
                  className={"w-full"}
                >
                  Add to cart
                </Button>
              </div>
              <Separator />
              <div className="max-h-[300px] overflow-auto">
                <h2 className="text-xl font-bold mb-4">Reviews</h2>
                <div className="grid gap-6">
                  <div className="flex gap-4">
                    <Avatar className={"w-10 h-10 border"}>
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="grid grid-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Manandhar</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        This is an awesome Product
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Avatar className={"w-10 h-10 border"}>
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="grid grid-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Manandhar</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        This is an awesome Product
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Avatar className={"w-10 h-10 border"}>
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="grid grid-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Manandhar</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        This is an awesome Product
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Avatar className={"w-10 h-10 border"}>
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="grid grid-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Manandhar</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        This is an awesome Product
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <Input placeholder="Write a review" />
                  <Button>Submit</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </DialogTitle>
      )}
    </Dialog>
  );
}
