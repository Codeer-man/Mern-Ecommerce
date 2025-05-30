import React, { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Edit, Scroll, StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchUserItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { setProductDetail } from "@/store/shop/product-slice";
import { Label } from "../ui/label";
import StarRatin from "../common/star-rating";
import {
  createProductReview,
  deleteReivew,
  getProductReview,
  resetReview,
  updateReivew,
  userReviewfetch,
} from "@/store/shop/product-review";
import StarRating from "../common/star-rating";
import { ScrollArea } from "../ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { MdDelete } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function ProductDetail({ open, setOpen, productDetail, user }) {
  // const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { cartItem } = useSelector((state) => state.shopCart);
  const { userReview, review } = useSelector((state) => state.productReview);
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
      toast.success("Review has been addded ");
    } catch (error) {
      setRating(0);
      setReviewMsg("");
      toast.error(error?.message || "something error");
    } finally {
      dispatch(getProductReview(productDetail._id));
    }
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
            `Only ${getTotalStock} quantity can be added for this item`
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
  }, [productDetail, dispatch]);

  const averageReview =
    review && review.length > 0
      ? review.reduce((sum, itemsReview) => sum + itemsReview.reviewValue, 0) /
        review.length
      : 0;

  function handleDelete(reviewId) {
    dispatch(deleteReivew({ reviewId: reviewId }));
  }

  function handleEdit(reviewId) {
    dispatch(updateReivew({ reviewId: reviewId }));
  }

  useEffect(() => {
    dispatch(
      userReviewfetch({ productId: productDetail?._id, userId: user?._id })
    );
  }, [productDetail, dispatch, user]);

  return (
    <Dialog open={open} onOpenChange={handleDialogueClose}>
      {open && (
        <DialogTitle>
          <DialogContent className="sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
            <ScrollArea className="max-h-[90vh] w-full pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={productDetail?.image}
                    alt={productDetail?.title}
                    className="aspect-square w-full object-cover"
                  />

                  {userReview !== null ? (
                    <div className="mt-8">
                      <div>
                        <h2 className="text-xl font-bold mb-4">Reviews</h2>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Edit onClick={() => handleEdit(userReview)} />
                            </TooltipTrigger>
                            <TooltipContent> Edit </TooltipContent>

                            <TooltipTrigger asChild>
                              <MdDelete
                                onClick={() => handleDelete(userReview._id)}
                              />
                            </TooltipTrigger>
                            <TooltipContent> Delete </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="flex gap-4">
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
                          {userReview.reply !== "" ? (
                            <Accordion className="mt-2 p-3 bg-gray-100 rounded-md w-[900vw]">
                              <AccordionItem value="item-1">
                                <AccordionTrigger className="font-semibold text-sm mb-1">
                                  Reply
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-gray-700">
                                  {userReview.reply}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
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
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-extrabold">
                    {productDetail?.title}
                  </h1>
                  <ScrollArea className="h-[180px] w-fullrounded-md border p-4">
                    <p className="text-muted-foreground text-xl mb-5 mt-4">
                      {productDetail?.description}
                    </p>
                  </ScrollArea>

                  <div className="flex items-center justify-between">
                    <p
                      className={`text-3xl font-bold ${
                        productDetail.salePrice > 0
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      ${productDetail.price}
                    </p>
                    {productDetail.salePrice > 0 && (
                      <p className="text-2xl font-bold">
                        ${productDetail.salePrice}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={averageReview} />
                    <span className="text-muted-foreground">
                      {averageReview.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-4 mb-5">
                    <Button
                      className="w-full"
                      disabled={productDetail.totalStock === 0}
                      onClick={() =>
                        handleAddToCart(
                          productDetail._id,
                          productDetail.totalStock
                        )
                      }
                    >
                      {productDetail.totalStock === 0
                        ? "Out of stock"
                        : "Add To Cart"}
                    </Button>
                  </div>

                  <Separator />

                  <div className="mt-5 max-h-[300px]  pr-2">
                    <h2 className="text-xl font-bold mb-4">Reviews</h2>
                    <div className="grid gap-6">
                      {review && review.length > 0 ? (
                        review.map((review) => (
                          <div key={review._id} className="flex gap-4">
                            <Avatar className="w-10 h-10 border">
                              <AvatarFallback>
                                {review.userName[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-bold">{review.userName}</h3>
                              <StarRating rating={review.reviewValue} />
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
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </DialogTitle>
      )}
    </Dialog>
  );
}
