import React, { useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

export default function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadImageUrl,
  setUploadImageUrl,
  setImageLoading,
  imageLoading,
  isEditedMode,
  isCustomStyling = false,
}) {
  const handleImageFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  };

  const handleRemoveImage = () => {
    setImageFile("");
    if (inputref.current) {
      inputref.current.value = "";
    }
  };

  async function uploadImageToCloudinary() {
    setImageLoading(true);
    const data = new FormData();
    data.append("Product", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/product/image-upload",
        data
      );

      if (response.data.success === true) {
        setUploadImageUrl(response.data.result.url);
      }
    } catch (error) {
      return console.error("invalid server error", error);
    } finally {
      setImageLoading(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  const inputref = useRef(null);
  return (
    <div
      className={`w-full  mb-2 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">
        Product Image upload
      </Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditedMode ? "opacity-40" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id={"image-upload"}
          type={"file"}
          className="hidden"
          ref={inputref}
          onChange={handleImageFileChange}
          disabled={isEditedMode}
        />
        {!imageFile ? (
          <label
            htmlFor="image-upload"
            className={` ${
              isEditedMode ? "cursor-not-allowed" : ""
            } flex flex-col justify-center items-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload</span>
          </label>
        ) : imageLoading ? (
          <Skeleton className="h-10 bg-gray-200" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
