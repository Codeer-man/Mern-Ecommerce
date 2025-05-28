import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "../ui/pagination";

export default function PaginationComponent({
  limit,
  page,
  totalPage,
  setPage,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setPage(page);
    setSearchParams({ page: String(page), limit: String(limit) });
  }, [page, limit, setSearchParams, setPage]);

  const handleChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage && newPage !== page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPages = () => {
    const pages = [];

    if (page > 2) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handleChange(1)} isActive={page === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (page > 3) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = page - 1; i <= page + 1; i++) {
      if (i > 1 && i < totalPage) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handleChange(i)}
              isActive={page === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    if (page < totalPage - 1) {
      if (page < totalPage - 2) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={totalPage}>
          <PaginationLink
            onClick={() => handleChange(totalPage)}
            isActive={page === totalPage}
          >
            {totalPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="w-full flex justify-center my-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
              onClick={() => handleChange(page - 1)}
            />
          </PaginationItem>

          {renderPages()}

          <PaginationItem>
            <PaginationNext
              className={
                page === totalPage ? "pointer-events-none opacity-50" : ""
              }
              onClick={() => handleChange(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
