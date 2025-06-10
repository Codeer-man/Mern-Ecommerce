import ProductDetail from "@/pages/shopping/Product-detail";
import ShopingProduct from "@/components/shopping/Product-tile";
import { Input } from "@/components/ui/input";
import { addToCart, fetchUserItems } from "@/store/shop/cart-slice";
import { getSingleProduct } from "@/store/shop/product-slice";
import { resetSearchResult, searchProduct } from "@/store/shop/search-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function SearchProduct() {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResult } = useSelector((state) => state.shopSearch);
  const { cartItem } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { productDetail } = useSelector((state) => state.shoppingProduct);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();

  function handleAddToCart(productId, getTotalStock) {
    let getCartItems = cartItem.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.ProductId === productId
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
    //! need to learn above this code

    dispatch(
      addToCart({ userId: user._id, ProductId: productId, quantity: 1 })
    ).then((data) => {
      if (data.payload.success === true) {
        dispatch(fetchUserItems(user._id));
        toast.success("Product has been added to cart");
      }
    });
  }
  function handleGetProductDetail(id) {
    dispatch(getSingleProduct(id));
  }

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      const debugTimer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyboard=${keyword}`));
        dispatch(searchProduct(keyword));
      }, 2000);
      return () => clearTimeout(debugTimer);
    } else {
      setSearchParams(new URLSearchParams(`?keyboard=${keyword}`));
      dispatch(resetSearchResult());
    }
  }, [keyword]);

  useEffect(() => {
    if (productDetail !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetail]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Search Products..."
          />
        </div>
      </div>
      {!searchResult.length ? (
        <h1 className="text-5xl font-extrabold">No result found!</h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResult.map((item) => (
          <ShopingProduct
            key={item._id}
            handleAddToCart={handleAddToCart}
            product={item}
            handleGetProductDetail={handleGetProductDetail}
          />
        ))}
      </div>
      <ProductDetail
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetail={productDetail}
      />
    </div>
  );
}
