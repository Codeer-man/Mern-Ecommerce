import ProductImageUpload from "@/components/admin/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import React, { Fragment, useState } from "react";

const initialFormData = {
  title: "",
  image: "",
  price: "",
  description: "",
  brand: "",
  category: "",
  salePrice: "",
  totalstock: "",
};

export default function Adminproduct() {
  const [openCreateProductsDialoge, setOpenCreateProductsDialoge] =
    useState(false);

  const onSubmit = () => {};

  const [formdata, setFormdata] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadImageUrl, setUploadImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialoge(true)}>
          Add New Product
        </Button>
      </div>
      <Sheet
        open={openCreateProductsDialoge}
        onChange={() => setOpenCreateProductsDialoge(false)}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add new Product</SheetTitle>
          </SheetHeader>
          <div className="py-6 p-5">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadImageUrl={uploadImageUrl}
              setUploadImageUrl={setUploadImageUrl}
              imageLoading={imageLoading}
              setImageLoading={setImageLoading}
            />
            <CommonForm
              formControls={addProductFormElements}
              formData={formdata}
              setFormData={setFormdata}
              buttonText="Add"
              onSubmit={onSubmit}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}
