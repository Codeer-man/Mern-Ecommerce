import React, { useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";

export default function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadImageUrl,
  setUploadImageUrl,
  setImageLoading,
}) {
  const handleImageFileChange = (e) => {
    // console.log(e.target.files, "e.target.files");
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
      console.log(response, "response");

      if (response.data.success === true) {
        setUploadImageUrl(response.data.result.url);
        setImageLoading(false);
      }
    } catch (error) {
      return console.error("invalid server error", error);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  const inputref = useRef(null);
  return (
    <div className="w-full max-w-md mx-auto mb-2 mt-4">
      <Label className="text-lg font-semibold mb-2 block">
        Product Image upload
      </Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4"
      >
        <Input
          id={"image-upload"}
          type={"file"}
          className="hidden"
          ref={inputref}
          onChange={handleImageFileChange}
        />
        {!imageFile ? (
          <label
            htmlFor="image-upload"
            className="flex flex-col justify-center items-center h-32 cursor-pointer"
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload</span>
          </label>
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
