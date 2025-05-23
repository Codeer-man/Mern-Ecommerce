import ProductImageUpload from "@/components/admin/image-upload";
import AdminProductTile from "@/components/admin/ProductTile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProduct,
  updateLabel,
} from "@/store/admin/product";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const initialFormData = {
  title: "",
  image: "",
  price: "",
  description: "",
  brand: "",
  category: "",
  salePrice: "",
  totalStock: "",
  list: false,
};

export default function Adminproduct() {
  const [openCreateProductsDialoge, setOpenCreateProductsDialoge] =
    useState(false);
  const [formdata, setFormdata] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadImageUrl, setUploadImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProduct);
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    currentEditedId !== null
      ? dispatch(editProduct({ id: currentEditedId, formdata })).then(
          (data) => {
            console.log(data, "edit");
            if (data.payload?.success === true) {
              dispatch(fetchAllProduct());
              setCurrentEditedId(null),
                setOpenCreateProductsDialoge(false),
                setFormdata(initialFormData);
            }
          }
        )
      : dispatch(
          addNewProduct({
            ...formdata,
            image: uploadImageUrl,
          })
        ).then((data) => {
          if (data.payload.success === true) {
            dispatch(fetchAllProduct());
            setFormdata(initialFormData), setImageFile(null);
            setOpenCreateProductsDialoge(false);
            toast.success(
              data.payload.message || "New product has been created"
            );
          }
        });
  };

  // function isFormValid() {
  //   return Object.keys(formdata)
  //     .map((key) => formdata[key] !== "")
  //     .every((item) => item);
  // }
  // console.log(isFormValid());

  function handleDelete(productId) {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data.payload.success === true) {
        dispatch(fetchAllProduct());
        setCurrentEditedId(null);
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllProduct());
  }, [dispatch]);

  function handleToggleList(product) {
    console.log(product._id, "product");

    dispatch(updateLabel({ id: product._id, list: !product.list }));
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialoge(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id} //for the time being
                setCurrentEditedId={setCurrentEditedId}
                setOpenCreateProductsDialoge={setOpenCreateProductsDialoge}
                product={productItem}
                setFormData={setFormdata}
                handleDelete={handleDelete}
                handleToggleList={handleToggleList}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialoge}
        onOpenChange={() => {
          setOpenCreateProductsDialoge(false);
          setFormdata(initialFormData);
          setCurrentEditedId(null);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null
                ? "Edit the product"
                : "Add new Product"}{" "}
            </SheetTitle>
          </SheetHeader>
          <div className=" p-5">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadImageUrl={uploadImageUrl}
              setUploadImageUrl={setUploadImageUrl}
              imageLoading={imageLoading}
              setImageLoading={setImageLoading}
              isEditedMode={currentEditedId}
            />
            <CommonForm
              formControls={addProductFormElements}
              formData={formdata}
              setFormData={setFormdata}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              onSubmit={onSubmit}
              // isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}
