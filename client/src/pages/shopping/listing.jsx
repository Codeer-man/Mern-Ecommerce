import ProductDetail from "@/components/shopping/Product-detail";
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
import { getShopProduct, getSingleProduct } from "@/store/shop/product-slice";
import { ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createQueryParamsHelper(filter) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filter)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramsValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramsValue)}`);
    }
  }
  return queryParams.join("&");
}

export default function ShoppingListing() {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [opendetailDialogue, setOpenDetailDialogue] = useState(false);
  const { products, productDetail } = useSelector(
    (state) => state.shoppingProduct
  );

  function handleGetProductDetail(id) {
    dispatch(getSingleProduct(id));
  }

  useEffect(() => {
    if (filter !== null && sort !== null)
      dispatch(getShopProduct({ filterParams: filter, sortParams: sort }));
  }, [dispatch, sort, filter]);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filter };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilter(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  useEffect(() => {
    setSort("lowtohigh");
    setFilter(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filter && Object.keys(filter).length > 0) {
      const createQuery = createQueryParamsHelper(filter);
      setSearchParams(createQuery);
    }
  }, [filter]);

  useEffect(() => {
    if (productDetail !== null) {
      setOpenDetailDialogue(true);
    }
  }, [productDetail]);

  // console.log(productDetail, "productDetail");
  console.log(productDetail, "productDetail");
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
                <ShopingProduct
                  product={products}
                  handleGetProductDetail={handleGetProductDetail}
                  key={products._id}
                />
              ))
            : null}
        </div>
      </div>
      <ProductDetail
        open={opendetailDialogue}
        setOpen={setOpenDetailDialogue}
        productDetail={productDetail}
      />
    </div>
  );
}
