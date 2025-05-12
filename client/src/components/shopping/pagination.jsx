import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export default function Pagination({ limit, page, totalPage, setPage }) {
  console.log(limit, page, totalPage, "pagination");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setPage(page);
    setSearchParams({ page, limit });
  }, [page, limit, setSearchParams]);

  function handlePageChangeDec() {
    setPage((prevpage) => {
      if (page > 1) return prevpage - 1;
      return prevpage;
    });
  }
  function handlePageChangeAdd() {
    setPage((prevpage) => {
      if (page < totalPage) return prevpage + 1;
      return prevpage;
    });
  }

  return (
    <div className="w-full h-10 flex items-center justify-center">
      <div>
        <div className="space-x-4 flex">
          <Button
            onClick={() => {
              handlePageChangeDec();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            variant="outline"
            className="border-2 border-gray-500 cursor-pointer"
            disabled={page === 1}
          >
            {page === 1 ? "The Start" : "Previous"}
          </Button>

          <Label className="border-2 px-3 border-black rounded-sm">
            {page}
          </Label>

          <Button
            onClick={() => {
              handlePageChangeAdd();
              if (page < totalPage) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            variant="outline"
            className="border-2 border-gray-500 cursor-pointer"
            disabled={page === totalPage}
          >
            {page === totalPage ? "The End" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
