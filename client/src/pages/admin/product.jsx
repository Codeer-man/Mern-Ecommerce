import ProductImageUpload from "@/components/admin/image-upload";
import AdminProductTile from "@/components/admin/ProductTile";
import CommonForm from "@/components/common/form";
import PaginationComponent from "@/components/shopping/pagination";
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
  subTitle: "",
  image: [],
  price: "",
  description: "",
  brand: "",
  category: "",
  salePrice: "",
  totalStock: "",
  list: false,
  sizes: [],
};

export default function Adminproduct() {
  const [openCreateProductsDialoge, setOpenCreateProductsDialoge] =
    useState(false);
  const [formdata, setFormdata] = useState(initialFormData);
  const [imageFile, setImageFile] = useState([]);
  const [uploadImageUrl, setUploadImageUrl] = useState({});
  const [imageLoading, setImageLoading] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem("admin-product-page");
    return savedPage ? parseInt(savedPage, 10) : 1;
  });

  const { productList, pageProductList } = useSelector(
    (state) => state.adminProduct
  );
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    if (currentEditedId !== null) {
      dispatch(editProduct({ id: currentEditedId, formdata })).then((data) => {
        if (data.payload?.success === true) {
          dispatch(fetchAllProduct({ page: page }));
          setCurrentEditedId(null),
            setOpenCreateProductsDialoge(false),
            setFormdata(initialFormData);
        }
      });
    } else {
      dispatch(
        addNewProduct({
          ...formdata,
          image: uploadImageUrl,
        })
      ).then((data) => {
        if (data.payload.success) {
          dispatch(fetchAllProduct({ page: page }));
          setFormdata(initialFormData), setImageFile([]);
          setUploadImageUrl({});
          setOpenCreateProductsDialoge(false);
          toast.success(data.payload.message || "New product has been created");
        }
      });
    }
  };

  // function isFormValid() {
  //   return Object.keys(formdata)
  //     .map((key) => formdata[key] !== "")
  //     .every((item) => item);
  // }

  function handleDelete(productId) {
    setLoading(true);
    try {
      dispatch(deleteProduct(productId)).then((data) => {
        if (data.payload.success) {
          dispatch(fetchAllProduct({ page: page })).then((data) => {});
          setCurrentEditedId(null);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      toast("Product deleted successfully!");
    }
  }

  function handleToggleList(product) {
    dispatch(updateLabel({ id: product._id, list: !product.list }));
  }

  useEffect(() => {
    sessionStorage.setItem("admin_Product_page", page.toString());
    dispatch(fetchAllProduct({ page: page }));
  }, [dispatch, page]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialoge(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      <PaginationComponent
        page={page}
        setPage={setPage}
        limit={pageProductList.limit}
        totalPage={pageProductList.totalPage}
      />
      <Sheet
        className={"w-screen"}
        open={openCreateProductsDialoge}
        onOpenChange={() => {
          setOpenCreateProductsDialoge(false);
          setFormdata(initialFormData);
          setCurrentEditedId(null);
        }}
      >
        <SheetContent side="right" className="overflow-auto ">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null
                ? "Edit the product"
                : "Add new Product"}
            </SheetTitle>
          </SheetHeader>
          <div className=" p-5">
            <ProductImageUpload
              imageFiles={imageFile}
              setImageFiles={setImageFile}
              uploadImageUrl={uploadImageUrl}
              setUploadedUrls={setUploadImageUrl}
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
