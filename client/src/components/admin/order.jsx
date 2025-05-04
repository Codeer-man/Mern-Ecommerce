import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog, DialogTitle } from "../ui/dialog";
import AdminOrdetailsView from "./order-view";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrderForAdmin,
  getOrderDetailForAdmin,
  resetOrderDetail,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

export default function AdminOrdersView() {
  const [openDetailsDialogue, setOpenDetailsDialogue] = useState(false);
  const { orderList, orderDetail } = useSelector((state) => state.adminOrder);

  function handleFetchOrderDetail(getId) {
    dispatch(getOrderDetailForAdmin(getId));
    setOpenDetailsDialogue(true);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrderForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetail !== null) setOpenDetailsDialogue(true);
  }, [orderDetail]);

  function handleDialogClose() {
    setOpenDetailsDialogue(false);
    // setSelectedOrderId(null);
    dispatch(resetOrderDetail());
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((list) => (
                <TableRow key={list._id}>
                  <TableCell>{list._id}</TableCell>
                  <TableCell>{list.orderDate?.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 ${
                        list?.oderstatus === "confirmed"
                          ? "bg-green-500"
                          : list?.oderstatus === "rejected"
                          ? "bg-red-600"
                          : "bg-black"
                      }`}
                    >
                      {list?.oderstatus}
                    </Badge>
                  </TableCell>
                  <TableCell>${list.totalAmount}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleFetchOrderDetail(list._id)}>
                      View details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={openDetailsDialogue} onOpenChange={handleDialogClose}>
        {orderDetail && <AdminOrdetailsView orderDetails={orderDetail} />}
      </Dialog>
    </Card>
  );
}
