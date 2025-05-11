import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";

export default function Pagination({ onProductChange }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPage, setTotalPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/pagination?page=${page}&limit=${limit}`
        );

        setTotalPage(response.data.totalpage);
        setSearchParams({ page, limit });
        if (onProductChange) {
          onProductChange(response.data.product);
        }
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchdata();
  }, [page, limit]);

  function handlePageChangeDec(nextpage) {
    if (page > 1) setPage(nextpage);
  }
  function handlePageChangeAdd(nextpage) {
    if (page < totalPage) setPage(nextpage + 1);
  }

  return (
    <div className="w-full h-10 flex items-center justify-center ">
      <div>
        <div className="space-x-4 flex">
          <Button
            onClick={() => {
              handlePageChangeDec(page - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            variant={"outline"}
            className={"border-2 border-gray-500 cursor-pointer "}
          >
            Previous
          </Button>
          <Button
            variant={"outline"}
            className={"border-2 border-gray-500 cursor-pointer "}
          >
            {page}
          </Button>
          <Button
            onClick={() => {
              handlePageChangeAdd(page);
              if (page < 5) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                null;
              }
            }}
            variant={"outline"}
            className={"border-2 border-gray-500 cursor-pointer "}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
