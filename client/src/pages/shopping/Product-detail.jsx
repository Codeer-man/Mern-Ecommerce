import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Edit } from "lucide-react";
import { Input } from "../../components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchUserItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { getSingleProduct, relatedProduct } from "@/store/shop/product-slice";
import { Label } from "../../components/ui/label";
import StarRating from "../../components/common/star-rating";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { MdDelete } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

import RelatedProduct from "../../components/shopping/relatedProduct";
import {
  createProductReview,
  deleteReivew,
  getProductReview,
  updateReivew,
  userReviewfetch,
} from "@/store/shop/product-review";
import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const dispatch = useDispatch();
  const { cartItem } = useSelector((state) => state.shopCart);
  const { userReview, review } = useSelector((state) => state.productReview);
  const { showRelatedProduct } = useSelector((state) => state.shoppingProduct);
  const { user } = useSelector((state) => state.auth);
  const { productDetail } = useSelector((state) => state.shoppingProduct);
  const [selectedSize, setSelectedSize] = useState("");
  const { id } = useParams();

  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  async function handleAddReview() {
    try {
      await dispatch(
        createProductReview({
          productId: productDetail._id,
          userId: user._id,
          userName: user.username,
          reviewMessage: reviewMsg,
          reviewValue: rating,
          reply: "",
        })
      ).unwrap();
      setRating(0);
      setReviewMsg("");
      toast.success("Review has been added");
    } catch (error) {
      setRating(0);
      setReviewMsg("");
      toast.error(error?.message || "Something went wrong");
    } finally {
      dispatch(getProductReview(productDetail._id));
    }
  }

  function handleAddToCart(ProductId, getTotalStock) {
    const getCartItems = cartItem.items || [];

    if (getCartItems.length) {
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

    dispatch(addToCart({ userId: user._id, ProductId, quantity: 1 })).then(
      (data) => {
        if (data.payload.success === true) {
          dispatch(fetchUserItems(user._id));
          toast.success("Product has been added");
        }
      }
    );
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

  function handleDelete(reviewId) {
    dispatch(deleteReivew({ reviewId }));
  }

  function handleEdit(reviewId) {
    dispatch(updateReivew({ reviewId }));
  }

  useEffect(() => {
    dispatch(getSingleProduct(id));
  }, [id]);

  console.log(productDetail?.sizes);

  return (
    <div className="w-screen h-screen bg-white rounded-lg shadow-lg   overflow-auto py-10 px-6 relative mt-11 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-20">
        <div className="rounded-lg">
          <img
            src={productDetail?.image[0].url}
            alt={productDetail?.title}
            className="w-full aspect-square object-contain rounded-lg"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-x text-centerl sm:text-3xl font-extrabold mb-2">
            {productDetail?.title}
          </h1>
          <h4 className="text-muted-foreground text-sm md:text-base">
            {productDetail?.subTitle}
          </h4>{" "}
          <div className="flex items-center gap-2">
            <h3
              className={`text-xl font-bold my-2 ${
                productDetail?.salePrice > 0
                  ? "line-through text-muted-foreground"
                  : ""
              }`}
            >
              $ {productDetail?.price}
            </h3>
            <h3 className="text-xl font-bold text-black">
              {productDetail?.salePrice > 0 ? productDetail?.salePrice : null}{" "}
            </h3>
          </div>
          <p className="font-semibold font-lg">
            Category : {productDetail?.category} && Brand :{" "}
            {productDetail?.brand}
          </p>
          <div className="my-4">
            <h4 className="font-semibold mb-2">Select Size</h4>
            <div className="flex flex-wrap gap-2">
              <div></div>
            </div>
            {selectedSize && (
              <p className="mt-2 text-sm text-gray-600">
                Selected size: <strong>{selectedSize}</strong>
              </p>
            )}
          </div>
          <div className="">
            <p className="text-muted-foreground text-sm md:text-base">
              {productDetail?.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p
              className={`text-xl font-bold ${
                productDetail?.salePrice > 0
                  ? "line-through text-muted-foreground"
                  : ""
              }`}
            >
              ${productDetail?.price}
            </p>
            {productDetail?.salePrice > 0 && (
              <p className="text-xl font-bold text-green-600">
                ${productDetail?.salePrice}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={averageReview} />
            <span className="text-sm text-muted-foreground">
              {averageReview.toFixed(2)}
            </span>
          </div>
          <div className="mt-4">
            <Button
              className="w-full"
              disabled={productDetail?.totalStock === 0}
              onClick={() =>
                handleAddToCart(productDetail._id, productDetail.totalStock)
              }
            >
              {productDetail?.totalStock === 0 ? "Out of stock" : "Add To Cart"}
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-8">
        <RelatedProduct
          className="w-full"
          showRelatedProduct={showRelatedProduct}
        />
      </div>

      {/* User Review */}
      <div className="mt-10">
        {userReview ? (
          <>
            <h2 className="text-xl font-bold mb-4">Your Review</h2>
            <TooltipProvider>
              <div className="flex items-center gap-3 mb-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Edit
                      onClick={() => handleEdit(userReview)}
                      className="cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <MdDelete
                      onClick={() => handleDelete(userReview._id)}
                      className="cursor-pointer text-red-500"
                    />
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            <div className="flex gap-4 mt-3">
              <Avatar className="w-10 h-10 border">
                <AvatarFallback>
                  {userReview.userName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">{userReview.userName}</h3>
                <StarRating rating={userReview.reviewValue} />
                <p className="text-muted-foreground">
                  {userReview.reviewMessage}
                </p>
                {userReview.reply && (
                  <Accordion className="mt-2 p-3 bg-gray-100 rounded-md">
                    <AccordionItem value="reply">
                      <AccordionTrigger className="font-semibold text-sm">
                        Reply
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-700">
                        {userReview.reply}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4 mt-4 space-y-3">
            <Label>Write a review</Label>
            <div className="flex gap-5">
              <StarRating
                rating={rating}
                handleRatingChange={handleRatingChange}
              />
            </div>

            <Input
              placeholder="Write your review"
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
            />
            <Button
              onClick={handleAddReview}
              disabled={reviewMsg.trim() === ""}
            >
              Submit
            </Button>
          </div>
        )}
      </div>

      {/* All Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">All Reviews</h2>
        <div className="grid gap-5 max-h-[300px] overflow-y-auto pr-2">
          {review && review.length > 0 ? (
            review.map((r) => (
              <div key={r._id} className="flex gap-4">
                <Avatar className="w-10 h-10 border">
                  <AvatarFallback>{r.userName[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{r.userName}</h3>
                  <StarRating rating={r.reviewValue} />
                  <p className="text-muted-foreground">{r.reviewMessage}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
