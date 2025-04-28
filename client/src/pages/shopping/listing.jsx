import ShopingProduct from "@/components/shopping/Product-tile";
import ProductFilter from "@/components/shopping/ProductFilter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { getShopProduct } from "@/store/shop/product-slice";
import { ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ShoppingListing() {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState(null);
  const { products } = useSelector((state) => state.shoppingProduct);

  useEffect(() => {
    dispatch(getShopProduct());
  }, [dispatch]);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOptions) {
    console.log("Function called");
    let cpyfilter = { ...filter };

    const indexOfcurrentSort = Object.keys(cpyfilter).indexOf(getSectionId);

    if (indexOfcurrentSort === -1) {
      cpyfilter = {
        ...cpyfilter,
        [getSectionId]: [getCurrentOptions],
      };
    } else {
      const indexOfCurrentOptions =
        cpyfilter[getSectionId].indexOf(getCurrentOptions);

      if (indexOfCurrentOptions === -1) {
        cpyfilter[getSectionId].push(getCurrentOptions);
      } else {
        cpyfilter[getSectionId].splice(indexOfCurrentOptions, 1);
      }
    }
    setFilter(cpyfilter);
    sessionStorage.setItem("filter", JSON.stringify(cpyfilter));
  }

  useEffect(()=> {
    
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filter={filter} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className=" p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {products.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((options) => (
                    <DropdownMenuRadioItem
                      value={options.id}
                      key={options.id}
                      className={"cursor-pointer"}
                    >
                      {options.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {products && products.length > 0
            ? products.map((products) => (
                <ShopingProduct product={products} key={products._id} />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
