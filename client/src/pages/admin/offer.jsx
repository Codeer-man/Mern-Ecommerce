import ProductImageUpload from "@/components/admin/image-upload";
import CommonForm from "@/components/common/form";
import PaginationComponent from "@/components/shopping/pagination";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createOfferForm } from "@/config";
import { createOffer } from "@/store/admin/offer-slice";
import { fetchAllProduct } from "@/store/admin/product";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const iniitalState = {
  name: "",
  tags: "",
  discountPercentage: 0,
};

export default function CreateOffer() {
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadImageUrl, setUploadedUrls] = useState({});
  const [imageLoading, setImageLoading] = useState(false);
  const [formData, setFormData] = useState(iniitalState);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem("admin-product-page");
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const { productList, pageProductList } = useSelector(
    (state) => state.adminProduct
  );
  const [selectProduct, setSelectProduct] = useState([]);

  const dispatch = useDispatch();

  function onSubmit(e) {
    e.preventDefault();
    dispatch(
      createOffer({
        formdata: formData,
        image: uploadImageUrl,
        productId: selectProduct,
      })
    ).then((data) => {
      if (data.payload.success) {
        setFormData(iniitalState);
        setUploadedUrls({});
        setSelectProduct([]);
        setImageFiles([]);
        toast("New Offer created");
      }
    });
  }

  function toggelProduct(id) {
    setSelectProduct((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      sessionStorage.setItem("admin-product-page", page.toString());
      dispatch(
        fetchAllProduct({
          page,
          query: searchQuery.trim() ? searchQuery : undefined,
        })
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery, page, dispatch]);

  return (
    <div className="">
      <div className="mb-6 border p-4 rounded-xl shadow-sm bg-white">
        <ProductImageUpload
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          setUploadedUrls={setUploadedUrls}
          setImageLoading={setImageLoading}
          imageLoading={imageLoading}
        />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="px-4 mb-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Add Products
          </button>
        </DialogTrigger>

        <DialogContent className="min-w-4xl max-h-[80vh] overflow-y-auto bg-white rounded-lg p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add Products
            </DialogTitle>
            <DialogDescription>
              <div>
                <input
                  type="text"
                  className="border-2 border-black p-1 rounded-sm"
                  placeholder="Search Product"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                  {pageProductList?.data?.map((data) => (
                    <div
                      key={data._id}
                      onClick={() => toggelProduct(data._id)}
                      className={`${
                        selectProduct.includes(data._id)
                          ? " border-pink-700 p-4"
                          : ""
                      } border rounded-lg p-4 flex flex-col items-center shadow-sm hover:shadow-md transition`}
                    >
                      <img
                        src={data?.image?.[0]?.url || "/placeholder.jpg"}
                        alt={data.title}
                        className="h-40 w-40 object-cover rounded-md mb-2"
                      />
                      <p className="text-sm font-medium text-center">
                        {data.title}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <PaginationComponent
                    page={page}
                    setPage={setPage}
                    limit={pageProductList.limit}
                    totalPage={pageProductList.totalPage}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="mb-6 border p-4 rounded-xl shadow-sm bg-white">
        <CommonForm
          formControls={createOfferForm}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
