import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getReview, replyProduct } from "@/store/admin/replyReview";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function AdminReview() {
  const { reviewList } = useSelector((state) => state.adminReview);
  const [replyMap, setReplyMap] = useState({});
  const [openDialogId, setOpenDialogId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReview());
  }, [dispatch]);

  const handleInputChange = (id) => (e) => {
    setReplyMap((prev) => ({
      ...prev,
      [id]: e.target.value,
    }));
  };

  const handleSubmit = (id) => (e) => {
    e.preventDefault();
    const reply = replyMap[id] || "";

    dispatch(replyProduct({ id, reply }))
      .then((res) => {
        if (res.payload.success) {
          toast.success("Reply submitted successfully");
          dispatch(getReview());
          setOpenDialogId(null);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to submit reply");
      });
  };

  const handleDialogOpenChange = (id, isOpen, existingReply) => {
    if (isOpen) {
      setOpenDialogId(id);
      setReplyMap((prev) => ({
        ...prev,
        [id]: existingReply || "",
      }));
    } else {
      setOpenDialogId(null);
    }
  };

  return (
    <Fragment>
      <Table>
        <TableCaption>Reviews</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>UserName</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>ProductDetail</TableHead>
            <TableHead>Reply</TableHead>
            <TableHead>Reply Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviewList?.length > 0 &&
            reviewList.map((review) => (
              <TableRow key={review._id}>
                <TableCell>{review.userName}</TableCell>
                <TableCell>{review.reviewValue}</TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger className="text-left max-w-[250px] line-clamp-2 cursor-pointer">
                      <Badge className={"p-1.5 bg-gray-500"}>
                        {review.reviewMessage}
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent>{review.reviewMessage}</HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      {review.productId.title}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        {review.productId.title}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <img
                          src={review.productId?.image}
                          alt={review.productId?.title}
                          height={200}
                          width={150}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger className="text-left max-w-[250px] line-clamp-2 cursor-pointer">
                      {review.reply === "" ? (
                        <Badge variant={"destructive"} className={"p-1.5"}>
                          Not replyed yet
                        </Badge>
                      ) : (
                        <Badge className={"p-1.5 bg-gray-500"}>
                          {review.reply}
                        </Badge>
                      )}
                    </HoverCardTrigger>
                    <HoverCardContent>
                      {review.reply === "" ? "Not replyed yet" : review.reply}
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <Dialog
                    open={openDialogId === review._id}
                    onOpenChange={(isOpen) =>
                      handleDialogOpenChange(review._id, isOpen, review.reply)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        {review.reply ? "Edit Reply" : "Reply"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Reply</DialogTitle>
                      <form
                        onSubmit={handleSubmit(review._id)}
                        className="flex flex-col gap-3"
                      >
                        <Input
                          placeholder="Write your reply here"
                          value={replyMap[review._id] || ""}
                          onChange={handleInputChange(review._id)}
                        />
                        <Button type="submit">Submit</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Fragment>
  );
}
