import { Minus, Plus, Trash } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { getShopProduct } from "@/store/shop/product-slice";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

export default function UserCartItemContain({ cartItems }) {
  const { user } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.shoppingProduct);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  function handleUpdateQuantity(getCartItem, buttonType) {
    console.log(products, "intesm");

    const productIndex = products?.data.findIndex(
      (product) => product._id === getCartItem?.ProductId
    );
    console.log(products);

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

  function navigateToProductD(id) {
    navigate(`/shop/product-detail/${id}`);
  }
  useEffect(() => {
    dispatch(getShopProduct());
  }, [dispatch]);

  console.log(cartItems);

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
        <div className="flex gap-3 justify-center items-center w-full ">
          <div className="relative group text-center cursor-pointer">
            <FaEye
              size={20}
              onClick={() => navigateToProductD(cartItems.ProductId)}
            />

            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-sm rounded px-2 py-1 z-10 whitespace-nowrap">
              view the product
            </div>
          </div>

          <Trash
            onClick={() => handleCartItemDelete(cartItems)}
            className="cursor-pointer mt-1"
            size={20}
          />
        </div>
      </div>
    </div>
  );
}
