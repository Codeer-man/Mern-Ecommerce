import { ScrollArea } from "@radix-ui/react-scroll-area";
import React from "react";
import { ScrollBar } from "../ui/scroll-area";

export default function RelatedProduct(showRelatedProduct) {
  return (
    <ScrollArea>
      <div className="mt-10 w-full">
        <h2 className="text-xl font-bold mb-4">Related Products</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4">
            {showRelatedProduct.showRelatedProduct.length > 0 ? (
              showRelatedProduct.showRelatedProduct.map((item) => (
                <div
                  key={item._id}
                  className="min-w-[200px] flex-shrink-0 border p-3 rounded-md"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <h3 className="mt-2 font-semibold text-sm">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    ${item.salePrice > 0 ? item.salePrice : item.price}
                  </p>
                </div>
              ))
            ) : (
              <p>No related products found.</p>
            )}
          </div>
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
