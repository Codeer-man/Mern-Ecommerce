import { Minus, Plus, Trash } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { getShopProduct } from "@/store/shop/product-slice";

export default function UserCartItemContain({ cartItems }) {
  const { user } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.shoppingProduct);

  const dispatch = useDispatch();

  function handleUpdateQuantity(getCartItem, buttonType) {
    const productIndex =
      products.data?.findIndex(
        (product) => product._id === getCartItem?.ProductId
      ) ?? -1;

    if (productIndex === -1) {
      toast.error("Product not found in store");
      return;
    }

    const currentQuantity = getCartItem.quantity;
    const totalStock = products.data[productIndex].totalStock;

    if (buttonType === "plus" && currentQuantity + 1 > totalStock) {
      toast.error(`Only ${totalStock} items available in stock`);
      return;
    }

    if (buttonType === "minus" && currentQuantity <= 1) {
      toast.warning("Minimum quantity is 1");
      return;
    }

    dispatch(
      updateCartQuantity({
        userId: user._id,
        ProductId: getCartItem.ProductId,
        quantity:
          buttonType === "minus" ? currentQuantity - 1 : currentQuantity + 1,
      })
    ).then((data) => {
      if (data.payload?.success) {
        toast.success("Quantity updated successfully");
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

  useEffect(() => {
    dispatch(getShopProduct());
  }, [dispatch]);


  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItems.image[0].url}
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
          <div>Size: {cartItems?.size}</div>
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
