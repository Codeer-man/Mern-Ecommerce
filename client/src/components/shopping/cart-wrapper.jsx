import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemContain from "./cart-items-contain";

export default function CartWrapper({ cartItems }) {
  const TotalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;
  console.log(TotalCartAmount);

  return (
    <SheetContent className="sm:max-w-md p-3">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
        <div className="mt-8 space-y-4">
          {cartItems && cartItems.length > 0
            ? cartItems.map((items) => (
                <div key={items.ProductId}>
                  <UserCartItemContain cartItems={items} />
                </div>
              ))
            : null}
        </div>
        <div className="mt-8 space-y-4">
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">${TotalCartAmount}</span>
          </div>
        </div>
      </SheetHeader>
      <Button className={"w-full mt-6"}>CheckOut</Button>
    </SheetContent>
  );
}
