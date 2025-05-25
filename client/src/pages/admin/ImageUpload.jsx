import { addFeatuerImage, getFeatuerImage } from "@/store/admin/feature-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductImageUpload from "../../components/admin/image-upload";
import { Button } from "../../components/ui/button";

export default function ImageUploadDashBaord() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { featureImage } = useSelector((state) => state.featureSlice);
  const [imagePublicId, setImagePublicId] = useState("");
  const dispatch = useDispatch();

  function handleUploadFeatureImage() {
    dispatch(addFeatuerImage(uploadedImageUrl)).then((data) => {
      if (data.payload.success) {
        dispatch(getFeatuerImage());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatuerImage());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadImageUrl={setUploadedImageUrl}
        setImageLoading={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        setImagePublicId={setImagePublicId}
        isCustomStyling={true}
        // isEditMode={currentEditedId !== null}
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
        {featureImage && featureImage.length > 0
          ? featureImage.map((image) => (
              <div key={image._id} className="relative">
                <img
                  src={image.image}
                  alt="image"
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
