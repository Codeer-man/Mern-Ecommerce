import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchUserItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { getSingleProduct, relatedProduct } from "@/store/shop/product-slice";
import RelatedProduct from "../../components/shopping/relatedProduct";
import {
  createProductReview,
  deleteReivew,
  getProductReview,
  updateReivew,
  userReviewfetch,
} from "@/store/shop/product-review";
import { useParams } from "react-router-dom";
import SelectSize from "@/components/shopping/selectsize";
import AllReview from "@/components/shopping/reviewall";

export default function ProductDetail() {
  const dispatch = useDispatch();
  const { cartItem } = useSelector((state) => state.shopCart);
  const { userReview, review } = useSelector((state) => state.productReview);
  const { showRelatedProduct } = useSelector((state) => state.shoppingProduct);
  const { user } = useSelector((state) => state.auth);
  const { productDetail } = useSelector((state) => state.shoppingProduct);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const { id } = useParams();

  // const [reviewMsg, setReviewMsg] = useState("");
  // const [rating, setRating] = useState(0);

  // function handleRatingChange(getRating) {
  //   setRating(getRating);
  // }

  //! handleReview
  // async function handleAddReview() {
  //   try {
  //     await dispatch(
  //       createProductReview({
  //         productId: productDetail._id,
  //         userId: user._id,
  //         userName: user.username,
  //         reviewMessage: reviewMsg,
  //         reviewValue: rating,
  //         reply: "",
  //       })
  //     ).unwrap();
  //     setRating(0);
  //     setReviewMsg("");
  //     toast.success("Review has been added");
  //   } catch (error) {
  //     setRating(0);
  //     setReviewMsg("");
  //     toast.error(error?.message || "Something went wrong");
  //   } finally {
  //     dispatch(getProductReview(productDetail._id));
  //   }
  // }

  function handleAddToCart(ProductId, getTotalStock) {
    const getCartItems = cartItem.items || [];

    if (getCartItems.length) {
      if (selectedSize === "") {
        return toast("please select a cloth size first");
      }
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.ProductId === ProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getTotalStock} quantity can be added for this item`
          );
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user._id,
        ProductId,
        quantity: 1,
        size: selectedSize,
      })
    ).then((data) => {
      if (data.payload.success) {
        dispatch(fetchUserItems(user._id));
        toast.success("Product has been added");
      }
    });
  }

  useEffect(() => {
    if (productDetail !== null) {
      dispatch(getProductReview(productDetail?._id));
    }
  }, [productDetail, dispatch]);

  useEffect(() => {
    dispatch(relatedProduct({ productId: productDetail?._id }));
  }, [productDetail]);

  useEffect(() => {
    dispatch(
      userReviewfetch({ productId: productDetail?._id, userId: user?._id })
    );
  }, [productDetail, dispatch, user]);

  const averageReview =
    review && review.length > 0
      ? review.reduce((sum, r) => sum + r.reviewValue, 0) / review.length
      : 0;

  // function handleDelete(reviewId) {
  //   dispatch(deleteReivew({ reviewId }));
  // }

  // function handleEdit(reviewId) {
  //   dispatch(updateReivew({ reviewId }));
  // }

  useEffect(() => {
    dispatch(getSingleProduct(id));
  }, [id]);

  useEffect(() => {
    if (productDetail?.image?.length > 0) {
      setMainImage(productDetail?.image[0]?.url);
    }
  }, [productDetail]);

  return (
    <div className="w-screen min-h-screen bg-white py-10 px-4 md:px-10 mt-11 overflow-auto rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex gap-4 md:grid-cols-1">
          <div className="flex flex-col gap-2 ">
            {productDetail?.image.map((img, index) => (
              <div
                key={index}
                className="w-20 h-20 border rounded-md overflow-hidden"
              >
                <img
                  src={img.url}
                  alt={`thumbnail-${index}`}
                  className="object-cover w-full h-full cursor-pointer"
                  onMouseEnter={() => setMainImage(img?.url)}
                />
              </div>
            ))}
          </div>

          <div className="flex-1 bg-gray-100 rounded-md overflow-hidden ">
            <img
              src={mainImage}
              alt={productDetail?.title}
              className="w-full aspect-square object-contain rounded-lg "
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            {productDetail?.title}
          </h1>
          <h4 className="text-muted-foreground text-sm md:text-base">
            {productDetail?.subTitle}
          </h4>

          <div className="flex items-center gap-4">
            <h3
              className={`text-xl font-bold ${
                productDetail?.salePrice > 0
                  ? "line-through text-muted-foreground"
                  : ""
              }`}
            >
              ${productDetail?.price}
            </h3>
            {productDetail?.salePrice > 0 && (
              <h3 className="text-xl font-bold text-green-600">
                ${productDetail?.salePrice}
              </h3>
            )}
          </div>

          <p className="font-medium text-sm">
            Category:{" "}
            <span className="text-gray-700">{productDetail?.category}</span>{" "}
            &nbsp; | Brand:{" "}
            <span className="text-gray-700">{productDetail?.brand}</span>
          </p>

          <div className="my-4">
            <h4 className="font-semibold mb-2">Select Size</h4>
            <div className="flex flex-wrap gap-2">
              <SelectSize
                size={productDetail?.sizes}
                setSelectedSize={setSelectedSize}
                selectSize={selectedSize}
              />
            </div>
          </div>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {productDetail?.description}
          </p>

          <Button
            className="w-full  mt-4"
            disabled={productDetail?.totalStock === 0}
            onClick={() =>
              handleAddToCart(productDetail._id, productDetail.totalStock)
            }
          >
            {productDetail?.totalStock === 0 ? "Out of stock" : "Add To Cart"}
          </Button>

          <AllReview review={review} />
        </div>
      </div>

      <div className="mt-10">
        <RelatedProduct
          className="w-full"
          showRelatedProduct={showRelatedProduct}
        />
      </div>
    </div>
  );
}
