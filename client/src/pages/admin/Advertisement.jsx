import AdvertisementTile from "@/components/admin/AdvertisementTile";
import ProductImageUpload from "@/components/admin/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdsForm } from "@/config";
import {
  createAds,
  DeleteAds,
  getAllAds,
  updateActive,
  updateAds,
} from "@/store/admin/advertisement";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const initalState = {
  title: "",
  targetUrl: "",
  image: [],
  description: "",
  isActive: false,
};

export default function Advertisement() {
  const [openCreateAdsDialogue, setOpenCreateAdsDialogue] = useState(false);
  const [formdata, setFormData] = useState(initalState);
  const [imageFile, setImageFile] = useState([]);
  const [uploadImageUrl, setUploadImageUrl] = useState({});
  const [imageLoading, setImageLoading] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { AdvertisementList } = useSelector(
    (state) => state.adminAdvertisement
  );

  function onSubmit(e) {
    e.preventDefault();

    if (currentEditedId !== null) {
      dispatch(updateAds({ id: currentEditedId, formdata })).then((data) => {
        if (data.payload?.success === true) {
          dispatch(getAllAds());
          setOpenCreateAdsDialogue(false);
          setCurrentEditedId(null);
          toast.success(data.payload.message);
        } else {
          toast.error(data.payload.message);
        }
      });
    } else {
      dispatch(
        createAds({
          ...formdata,
          image: uploadImageUrl,
        })
      )
        .then((data) => {
          if (data.payload?.success) {
            dispatch(getAllAds());
            setOpenCreateAdsDialogue(false);
            setFormData(initalState);
            setImageFile(null);
            setImageLoading(false);
            toast.success(data.payload.message || "Ads created succesfully");
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error(data.payload.message || "error while uploading ads");
        });
    }
  }

  function handleEditAdvertiesment(AdsDetail) {
    dispatch(updateAds(AdsDetail._id)).then((res) => {
      if (res.payload?.success === true) {
        dispatch(getAllAds());
        setOpenCreateAdsDialogue(false);
        setCurrentEditedId(null);
        toast.success(res.payload.message);
      }
    });
  }

  function handleDeleteAdvertiesment(Ad_id) {
    setLoading(true);
    try {
      dispatch(DeleteAds(Ad_id)).then((data) => {
        if (data.payload?.success) {
          dispatch(getAllAds());
        }
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  function handleToggleList(item) {
    dispatch(updateActive({ id: item._id, isActive: !item.isActive }));
  }

  useEffect(() => {
    dispatch(getAllAds());
  }, [dispatch]);

  console.log(AdvertisementList, "list");

  return (
    <div className="w-full h-full flex flex-col gap-2 p-6 bg-white shadow-md rounded-lg">
      <div className=" w-full flex justify-end">
        <Button
          onClick={() => setOpenCreateAdsDialogue(!openCreateAdsDialogue)}
          className={"cursor-pointer"}
        >
          Create Ads
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AdvertisementList &&
          AdvertisementList.length > 0 &&
          AdvertisementList.map((item) => (
            <AdvertisementTile
              key={item._id}
              item={item}
              setOpenCreateAdsDialogue={setOpenCreateAdsDialogue}
              handleEditAdvertiesment={handleEditAdvertiesment}
              setCurrentEditedId={setCurrentEditedId}
              setFormData={setFormData}
              handleDeleteAdvertiesment={handleDeleteAdvertiesment}
              handleToggleList={handleToggleList}
            />
          ))}
      </div>

      <Sheet
        open={openCreateAdsDialogue}
        onOpenChange={() => {
          setOpenCreateAdsDialogue(false);
          setCurrentEditedId(null);
          setFormData(initalState);
        }}
      >
        <ScrollArea></ScrollArea>
        <SheetContent
          side="right"
          className={"p-4 rounded-sm w-[500px] overflow-auto"}
        >
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null
                ? "Edit Advertisment"
                : "Add Advertisment"}
            </SheetTitle>
          </SheetHeader>
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
            formControls={AdsForm}
            formData={formdata}
            setFormData={setFormData}
            onSubmit={onSubmit}
            buttonText={
              currentEditedId !== null
                ? "Update Advertisment"
                : "Add Advertisment"
            }
            isBtnDisabled={false}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
