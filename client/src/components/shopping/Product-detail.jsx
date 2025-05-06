import React, { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchUserItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { setProductDetail } from "@/store/shop/product-slice";
import { Label } from "../ui/label";
import StarRatin from "../common/star-rating";
import {
  createProductReview,
  getProductReview,
  resetReview,
} from "@/store/shop/product-review";
import StarRating from "../common/star-rating";

export default function ProductDetail({ open, setOpen, productDetail }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { cartItem } = useSelector((state) => state.shopCart);
  const { review } = useSelector((state) => state.productReview);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddReview() {
    dispatch(
      createProductReview({
        productId: productDetail._id,
        userId: user._id,
        userName: user.username,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success === true) {
        setRating(0);
        setReviewMsg("");
        dispatch(getProductReview(productDetail._id));
        toast.success("Review has been addded ");
      }
    });
  }

  function handleAddToCart(ProductId, getTotalStock) {
    let getCartItems = cartItem.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.ProductId === ProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this item`
          );
          return;
        }
      }
    }

    dispatch(
      addToCart({ userId: user._id, ProductId: ProductId, quantity: 1 })
    ).then((data) => {
      if (data.payload.success === true) {
        dispatch(fetchUserItems(user._id));
        toast.success("Product had been added");
      }
    });
  }

  function handleDialogueClose() {
    setOpen(false);
    dispatch(resetReview());
    dispatch(setProductDetail());
  }

  useEffect(() => {
    if (productDetail !== null) {
      dispatch(getProductReview(productDetail._id));
    }
  }, [productDetail]);

  const averageReview =
    review && review.length > 0
      ? review.reduce((sum, itemsReview) => sum + itemsReview.reviewValue, 0) /
        review.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogueClose}>
      {open && (
        <DialogTitle>
          <DialogContent
            className={
              "grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]"
            }
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={productDetail?.image}
                alt={productDetail?.title}
                width={600}
                height={600}
                className=" aspect-square w-full object-cover"
              />
            </div>
            <div>
              <div>
                <h1 className="text-3xl font-extrabold">
                  {productDetail?.title}
                </h1>
                <p className="text-muted-foreground text-2xl mb-5 mt-4">
                  {productDetail?.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p
                  className={`text-3xl font-bold  ${
                    productDetail.salePrice > 0
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  ${productDetail.price}
                </p>
                <p className="text-2xl font-bold ">
                  {productDetail.salePrice > 0 ? "$" : null}
                  {productDetail.salePrice > 0 ? productDetail.salePrice : null}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={averageReview} />
                <span className="text-muted-foreground">
                  {" "}
                  {averageReview.toFixed(2)}
                </span>
              </div>
              <div className="mt-4 mb-5">
                {productDetail.totalStock === 0 ? (
                  <Button
                    className={"w-full"}
                    disabled={productDetail.totalStock === 0}
                  >
                    Out of stock
                  </Button>
                ) : (
                  <Button
                    className={"w-full"}
                    onClick={() =>
                      handleAddToCart(
                        productDetail._id,
                        productDetail.totalStock
                      )
                    }
                  >
                    Add To Cart
                  </Button>
                )}
              </div>
              <Separator />
              <div className="max-h-[300px] overflow-auto">
                <h2 className="text-xl font-bold mb-4">Reviews</h2>
                <div className="grid gap-6">
                  {review && review.length > 0 ? (
                    review.map((review) => (
                      <div key={review._id} className="flex gap-4">
                        <Avatar className={"w-10 h-10 border"}>
                          <AvatarFallback>
                            {review.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid grid-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{review.userName}</h3>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <StarRating rating={review.reviewValue} />
                          </div>
                          <p className="text-muted-foreground">
                            {review.reviewMessage}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <h1>No reviews</h1>
                  )}
                </div>
                <div className="mt-10 flex gap-2  flex-col space-y-2">
                  <Label>Write a review</Label>
                  <div className="flex ">
                    <StarRatin
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                  <Input
                    placeholder="Write a review"
                    name="reviewMsg"
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
              </div>
            </div>
          </DialogContent>
        </DialogTitle>
      )}
    </Dialog>
  );
}
