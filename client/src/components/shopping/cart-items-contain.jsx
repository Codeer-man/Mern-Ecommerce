import { Minus, Plus, Trash } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";

export default function UserCartItemContain({ cartItems }) {
  const { user } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.shoppingProduct);

  const dispatch = useDispatch();

  function handleUpdateQuantity(cartItem, buttonType) {
    if (buttonType === "plus") {
      const currentProduct = products.find(
        (product) => product._id === cartItem.ProductId
      );

      if (!currentProduct) {
        toast.error("Product not found");
        return;
      }

      const totalStock = currentProduct.totalStock;

      if (cartItem.quantity + 1 > totalStock) {
        toast.error(`Only ${totalStock} quantity is available in stock`);
        return;
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user._id,
        ProductId: cartItem.ProductId,
        quantity:
          buttonType === "minus"
            ? cartItem?.quantity - 1
            : cartItem?.quantity + 1,
      })
    ).then((data) => {
      if (data.payload.success) {
        toast.success("Quantity updated successfullt");
      }
    });
  }

  function handleCartItemDelete(cartItems) {
    dispatch(
      deleteCartItem({ userId: user._id, ProductId: cartItems.ProductId })
    ).then((data) => {
      if (data.payload.success) {
        toast.success("Product deleted successfullt");
      }
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItems.image}
        alt={cartItems.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItems?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItems?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItems, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItems.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItems?.quantity === cartItems?.quantity.length}
            onClick={() => handleUpdateQuantity(cartItems, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItems?.salePrice > 0
              ? cartItems?.salePrice
              : cartItems?.price) * cartItems?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItems)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}
