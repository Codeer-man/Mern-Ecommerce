import React from "react";
import { Button } from "../ui/button";
import { StarIcon } from "lucide-react";

export default function StarRating({ rating, handleRatingChange }) {
  return [1, 2, 3, 4, 5].map((star, index) => (
    <Button
      key={index}
      className={`p-2 rounded-full transition-colors ${
        star <= rating
          ? "text-yellow-500 hover:bg-black"
          : "text-black hover:bg-primary hover:text-primary-foreground"
      }`}
      variant="outline"
      size="icon"
      onClick={handleRatingChange ? () => handleRatingChange(star) : null}
    >
      <StarIcon
        className={`w-6 h-6 ${
          star <= rating ? "fill-yellow-500" : "fill-black"
        }`}
      />
    </Button>
  ));
}

export const ShowStarRating = ({ rating }) => {
  const star = Array.from({ length: 5 });

  return (
    <div className="flex w-full items-center justify-around">
      {star.map((star, index) => {
        index++;
        return (
          <div key={index}>
            <StarIcon
              className={`${
                index <= rating
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-black"
              } border rounded-full`}
              size={20}
            />
          </div>
        );
      })}
    </div>
  );
};
