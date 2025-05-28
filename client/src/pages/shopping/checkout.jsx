import React, { useState } from "react";
import img from "../../assets/bg.jpeg";
import { Button } from "@/components/ui/button";
import Address from "@/components/shopping/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemContain from "@/components/shopping/cart-items-contain";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";
import AdsForShowing from "@/components/Advertisement/ads";

export default function ShoppingCheckout() {
  const { cartItem } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [isPaymentStart, setIsPaymentStart] = useState("Checkout with paypal");
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const { approveUrl } = useSelector((state) => state.shopOrder);

  const dispatch = useDispatch();
  // console.log(cartItem, "cart");

  const TotalCartAmount =
    cartItem && cartItem.items && cartItem.items.length > 0
      ? cartItem.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const deliveryCharge = 120;
  const NumberOfProducts = cartItem?.items?.length;
  const totalDeliveryCharge = deliveryCharge * NumberOfProducts;
  const grandTotal = totalDeliveryCharge + TotalCartAmount;



  function handleInitiatePaypalPayment() {
    if (cartItem.items.length === 0) {
      toast.error("Your cart item is empty.Please add item to proceed");
      return;
    }
    if (currentSelectedAddress === null) {
      toast.error("Please select a address first");
      return;
    }

    const orderData = {
      userId: user._id,
      CartId: cartItem._id,
      cartItems: cartItem.items.map((items) => ({
        productId: items.ProductId,
        title: items.title,
        image: items.image,
        price: items.salePrice > 0 ? items.salePrice : items.price,
        quantity: items.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress.Address,
        city: currentSelectedAddress.City,
        pincode: currentSelectedAddress.Pincode,
        phoneNo: currentSelectedAddress.PhoneNo,
        notes: currentSelectedAddress.Notes,
      },
      oderstatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      deliveryCharge: totalDeliveryCharge,
      totalAmount: grandTotal,
      orderDate: new Date(),
      orderUpdate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then(() => {
      setIsPaymentStart("Processing Paypal payment");
    });
  }

  if (approveUrl) {
    window.location.href = approveUrl.approveURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItem && cartItem.items && cartItem.items.length > 0
            ? cartItem.items.map((cartItem, index) => (
                <UserCartItemContain key={index} cartItems={cartItem} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center font-semibold">
              <h2>Delivery Charge</h2>
              <h2>${totalDeliveryCharge} </h2>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${grandTotal}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {
                /* {isPaymentStart
                ? "Processing Paypal payment"
                : "Checkout with paypal"} */
                isPaymentStart
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
