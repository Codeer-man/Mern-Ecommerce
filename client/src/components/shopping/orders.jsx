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
  const [expandedOrders, setExpandedOrders] = useState({}); // new state

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

  function toggleExpanded(orderId) {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
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
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((order) => (
                <React.Fragment key={order._id}>
                  <TableRow>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.purchaseDate?.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          order.productstatus?.trim() === "confirmed"
                            ? "bg-green-500"
                            : order.paymentStatus?.trim() === "rejected"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {order.paymentStatus?.trim()}
                      </Badge>
                    </TableCell>
                    <TableCell>${order.totalPrice}</TableCell>
                    <TableCell>
                      {order.cartItems?.length} item
                      {order.cartItems?.length > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button onClick={() => toggleExpanded(order._id)}>
                        {expandedOrders[order._id]
                          ? "Hide Items"
                          : "Show Items"}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {expandedOrders[order._id] &&
                    order.cartItems?.map((item, index) => (
                      <TableRow
                        key={item._id || index}
                        // onClick={() => handleFetchOrderDetail(order._id)}
                      >
                        <TableCell colSpan={6}>
                          <div className="flex items-center justify-between w-full py-4">
                            <div className="flex items-center gap-4 ml-4 ">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-semibold">{item.title}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${item.price}</p>
                              </div>
                            </div>
                            {order.paymentStatus === "Paid" ? (
                              <div className="font-semibold hover:underline">
                                Give a review
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
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
