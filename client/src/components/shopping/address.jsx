import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  createAddress,
  deleteAddress,
  fetchAddress,
  updadateAddress,
} from "@/store/shop/address-slice";
import { toast } from "sonner";
import AddressCard from "./address-card";

const intialAddressFormData = {
  Address: "",
  PhoneNo: 0,
  Pincode: 0,
  Notes: "",
  City: "",
};

export default function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setformdata] = useState(intialAddressFormData);
  const [currentEditedData, setCurrentEditedData] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { address } = useSelector((state) => state.shopAddress);

  function isValid() {
    return Object.keys(formData)
      .map((keys) => formData[keys] !== "")
      .every((item) => item);
  }

  function handleManageAddress(e) {
    e.preventDefault();

    if (address.length >= 3 && currentEditedData === null) {
      toast.error("You can only add 3 address");
      setformdata(intialAddressFormData);
      return;
    }

    currentEditedData !== null
      ? dispatch(
          updadateAddress({
            userId: user._id,
            addressId: currentEditedData,
            formData,
          })
        ).then((data) => {
          if (data.payload.success === true) {
            dispatch(
              fetchAddress(user._id),
              setformdata(intialAddressFormData),
              setCurrentEditedData(null)
            );
            toast.success("Address Added");
          }
        })
      : dispatch(
          createAddress({
            ...formData,
            UserId: user._id,
          })
        ).then((data) => {
          if (data.payload.success === true) {
            dispatch(fetchAddress(user._id));
            toast.success("Address has been added");
            setformdata(intialAddressFormData);
          }
        });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedData(getCurrentAddress._id);
    setformdata({
      Address: getCurrentAddress.Address,
      PhoneNo: getCurrentAddress.PhoneNo,
      Pincode: getCurrentAddress.Pincode,
      Notes: getCurrentAddress.Notes,
      City: getCurrentAddress.City,
    });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user._id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data.payload.success === true) {
        dispatch(fetchAddress(user._id));
        toast.success("Address deleted");
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAddress(user._id));
  }, [dispatch]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
        {address && address.length > 0
          ? address.map((singleAddress, index) => (
              <AddressCard
                key={index}
                selectedId={selectedId}
                addressInfo={singleAddress}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedData !== null ? "Edit The Address" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent className={"space-y-3"}>
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setformdata}
          buttonText={currentEditedData !== null ? "Edit " : "Add"}
          onSubmit={handleManageAddress}
          //   isBtnDisabled={!isValid()}
        />
      </CardContent>
    </Card>
  );
}
