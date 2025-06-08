import React, { Fragment } from "react";
import { Accordion, AccordionContent, AccordionTrigger } from "../ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";
import { Separator } from "../ui/separator";
import StarRating from "../common/star-rating";
import { useSelector } from "react-redux";

export default function AllReview() {
  const { review } = useSelector((state) => state.productReview);
  console.log(review, "all review");

  return (
    <Fragment>
      <Accordion type="single" collapsible>
        <AccordionItem value="review">
          <AccordionTrigger className={"font-bold text-lg"}>
            Reviews {review.length}
          </AccordionTrigger>
          <AccordionContent>
            {review && review.length > 0 ? (
              review.map((r) => (
                <div key={r._id} className="flex gap-4">
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>
                      {r.userName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold">{r.userName}</h3>
                    <StarRating rating={r.reviewValue} />
                    <p className="text-muted-foreground">{r.reviewMessage}</p>
                  </div>
                </div>
              ))
            ) : (
              <h1 className="font-semibold text-gray-500 text-lg">
                No Review Yet
              </h1>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Separator />
    </Fragment>
  );
}
