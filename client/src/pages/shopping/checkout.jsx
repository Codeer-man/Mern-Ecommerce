import React, { useState } from "react";
import img from "../../assets/bg.jpeg";
import { Button } from "@/components/ui/button";
import Address from "@/components/shopping/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemContain from "@/components/shopping/cart-items-contain";
import { cashOndelivery, createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";
import AdsForShowing from "@/components/Advertisement/ads";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { fetchUserItems } from "@/store/shop/cart-slice";

export default function ShoppingCheckout() {
  const { cartItem } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [isPaymentStart, setIsPaymentStart] = useState("Not working");
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const { approveUrl } = useSelector((state) => state.shopOrder);
  const navigate = useNavigate();

  const dispatch = useDispatch();

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

  const deliveryCharge = 80;
  const NumberOfProducts = cartItem?.items?.length;
  const totalDeliveryCharge = deliveryCharge * NumberOfProducts;
  const grandTotal = totalDeliveryCharge + TotalCartAmount;

  function handleInitiateEsewaPayment() {
    if (cartItem.items.length === 0) {
      toast.error("Your cart item is empty.Please add item to proceed");
      return;
    }
    if (currentSelectedAddress === null) {
      toast.error("Please select a address first");
      return;
    }

    const orderData = {
      amount: TotalCartAmount,
      tax_amount: 0,
      total_amount: grandTotal,
      product_service_charge: 0,
      product_delivery_charge: totalDeliveryCharge,
      transaction_uuid: uuidv4,
      product_code: "EPAYTEST",
      success_url: "http://localhost:5173/shop/paypal-return",
      failed_url: "http://localhost:5173/shop/paypal-return",
      signed_field_name: "total_amount,transaction_uuid,product_code",
      signature: "",
      secret: "8gBm/:&EnhH.1/q",
      cartId: cartItem?._doc?._id,
      addressId: currentSelectedAddress?._id,
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      setIsPaymentStart("Processing Esewa payment");
    });
  }

  if (approveUrl) {
    window.location.href = approveUrl;
  }

  function handleCashOnDelivery() {
    if (cartItem.items.length === 0) {
      toast.error("Your cart item is empty.Please add item to proceed");
      return;
    }
    if (currentSelectedAddress === null) {
      toast.error("Please select a address first");
      return;
    }

    dispatch(
      cashOndelivery({
        cartId: cartItem._doc._id,
        deliveryCharge: deliveryCharge,
        totalPrice: grandTotal,
        addressId: currentSelectedAddress._id,
      })
    ).then((data) => {
      if (data.payload.success) {
        navigate("/shop/account");
        dispatch(fetchUserItems(user._id));
      }
    });
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
          <div className="mt-4 space-y-3 w-full">
            <Button onClick={handleInitiateEsewaPayment} className="w-full">
              {isPaymentStart}
            </Button>
            <Button onClick={handleCashOnDelivery} className="w-full">
              Cash On Delivery
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
