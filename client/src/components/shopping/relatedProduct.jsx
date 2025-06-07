import { ScrollArea } from "@radix-ui/react-scroll-area";
import React from "react";
import { ScrollBar } from "../ui/scroll-area";
import { useNavigate } from "react-router-dom";

export default function RelatedProduct({ showRelatedProduct }) {
  const navigate = useNavigate();

  function handleGetProductDetail(id) {
    window.scrollTo(0, 0);
    navigate(`/shop/product-detail/${id}`);
  }

  return (
    <ScrollArea>
      <div className="mt-10 w-full">
        <h2 className="text-4xl font-bold mb-6 text-center">
          Related Products
        </h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4 px-4">
            {showRelatedProduct.length > 0 ? (
              showRelatedProduct.map((item) => (
                <div
                  onClick={() => handleGetProductDetail(item._id)}
                  key={item._id}
                  className="w-[28.5%] h-[400px] flex-shrink-0 border p-4 rounded-xl shadow-md bg-gray-200 cursor-pointer"
                >
                  <img
                    src={item.image[0].url}
                    alt={item.title}
                    className="w-full h-64 object-contain rounded-md"
                  />
                  <h1 className="mt-4 font-semibold text-lg">{item.title}</h1>
                  <h3 className="text-sm text-gray-600">{item.subTitle}</h3>
                  <p className="text-muted-foreground text-sm mt-2">
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
