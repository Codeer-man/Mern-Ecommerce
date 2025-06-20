import React, { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

export default function ProductImageUpload({
  imageFiles,
  setImageFiles,
  setUploadedUrls,
  setImageLoading,
  imageLoading,
  isEditedMode,
  isCustomStyling = false,
}) {
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef(null);

  const handleImageFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setImageFiles(selectedFiles);
      setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length > 0) {
      setImageFiles(droppedFiles);
      setPreviews(droppedFiles.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleRemoveImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setImageFiles(newFiles);
    setPreviews(newPreviews);
  };
  
  const uploadImages = async () => {
    setImageLoading(true);
    try {
      let uploaded = [];

      for (const file of imageFiles) {
        const data = new FormData();
        data.append("images", file);

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/product/image-upload`,
          data
        );

        if (response.data.success) {
          uploaded.push({
            url: response.data.images[0].url,
            publicId: response.data.images[0].publicId,
          });
        }
      }
      setUploadedUrls(uploaded);
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    if (imageFiles?.length > 0) uploadImages();
  }, [imageFiles]);

  return (
    <div className={`w-full mb-2 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Image Upload</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditedMode ? "opacity-40" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          type="file"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditedMode}
        />

        {imageFiles?.length === 0 ? (
          <label
            htmlFor="image-upload"
            className={`${
              isEditedMode ? "cursor-not-allowed" : ""
            } flex flex-col justify-center items-center h-32 cursor-pointer`}
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload</span>
          </label>
        ) : imageLoading ? (
          <Skeleton className="h-10 bg-gray-200" />
        ) : (
          <div className="space-y-3">
            {imageFiles?.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between border p-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <FileIcon className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveImage(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {previews.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`preview-${index}`}
              className="w-full h-32 object-cover rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
}
