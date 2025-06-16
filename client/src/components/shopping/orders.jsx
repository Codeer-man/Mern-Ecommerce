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
import { Dialog } from "../ui/dialog";
import ShoppingOrderDetailView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrderByUser,
  getOrderDetail,
  resetOrderDetail,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

export default function ShoppingOrders() {
  const [openDetails, setOpenDetail] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetail } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetail(orderId) {
    setSelectedOrderId(orderId);
    dispatch(getOrderDetail(orderId));
  }

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrderByUser(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (orderDetail?._id === selectedOrderId) {
      setOpenDetail(true);
    }
  }, [orderDetail, selectedOrderId]);

  function handleDialogClose() {
    setOpenDetail(false);
    setSelectedOrderId(null);
    dispatch(resetOrderDetail());
  }
  console.log(orderList);

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

      <Dialog open={openDetails} onOpenChange={handleDialogClose}>
        {orderDetail && <ShoppingOrderDetailView orderDetail={orderDetail} />}
      </Dialog>
    </Card>
  );
}
