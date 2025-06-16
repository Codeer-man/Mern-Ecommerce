import { addFeatuerImage, getFeatuerImage } from "@/store/admin/feature-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductImageUpload from "../../components/admin/image-upload";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function ImageUploadDashBaord() {
  const [imageFile, setImageFile] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState({});
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { featureImage } = useSelector((state) => state.featureSlice);
  const dispatch = useDispatch();

  function handleUploadFeatureImage() {
    dispatch(addFeatuerImage(uploadedImageUrl)).then((data) => {
      if (data.payload.success) {
        dispatch(getFeatuerImage());
        setImageFile([]);
        setUploadedImageUrl({});
        toast("image uploaded");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatuerImage());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFiles={imageFile}
        setImageFiles={setImageFile}
        setUploadedUrls={setUploadedImageUrl}
        setImageLoading={setImageLoadingState}
        imageLoading={imageLoadingState}
        isCustomStyling={true}
      />
      <Button
        disabled={imageLoadingState || uploadedImageUrl === ""}
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
      >
        {imageLoadingState
          ? "Loading..."
          : uploadedImageUrl === ""
          ? "Upload"
          : "Upload"}
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImage &&
        featureImage[0]?.image &&
        featureImage[0]?.image?.length > 0 ? (
          featureImage[0].image.map((image) => (
            <div key={image._id} className="relative">
              <img
                src={image?.url}
                alt="image"
                className="w-full h-[300px] object-cover rounded-t-lg"
              />
            </div>
          ))
        ) : (
          <div>Computer thugin you</div>
        )}
      </div>
    </div>
  );
}
