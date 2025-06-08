import React from "react";

export default function review() {
  return (
    <div>
      {/* <div className="mt-12">
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
          <div className="flex flex-col gap-4 mt-4">
            <Label>Write a review</Label>
            <StarRating
              rating={rating}
              handleRatingChange={handleRatingChange}
            />
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
      </div> */}
    </div>
  );
}
