import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function AddressCard({
  addressInfo,
  handleEditAddress,
  handleDeleteAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={` cursor-pointer ${
        selectedId._id === addressInfo._id
          ? " border-red-700 border-[2px]"
          : "border-black"
      }`}
    >
      <CardContent
        className={`${
          selectedId === addressInfo._id ? "border-black" : ""
        } grid p-4 gap-4`}
      >
        <Label>Address: {addressInfo?.Address}</Label>
        <Label>City: {addressInfo?.City}</Label>
        <Label>pincode: {addressInfo?.Pincode}</Label>
        <Label>Phone: {addressInfo?.PhoneNo}</Label>
        <Label>Notes: {addressInfo?.Notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}
