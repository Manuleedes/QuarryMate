import {
  Avatar,
  AvatarGroup,
  Backdrop,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchQuarriesOrder,
  updateOrderStatus,
} from "../../State/Admin/Order/quarries.order.action";

const orderStatusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
];

const OrdersTable = ({ isDashboard, name }) => {
  const dispatch = useDispatch();
  const { quarryId } = useParams();
  const jwt = localStorage.getItem("jwt");

  const { orders, loading, error } = useSelector((store) => store.quarriesOrder) || {
    loading: false,
    orders: [],
    error: null,
  };

  const [anchorElArray, setAnchorElArray] = useState([]);

  const fetchOrders = () => {
    if (jwt && quarryId) {
      dispatch(fetchQuarriesOrder({ quarryId, orderStatus: "", jwt }));
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [dispatch, jwt, quarryId]);

  const handleUpdateStatusMenuClick = (event, index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
  };

  const handleUpdateStatusMenuClose = (index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = null;
    setAnchorElArray(newAnchorElArray);
  };

  const handleUpdateOrder = (orderId, orderStatus, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(updateOrderStatus({ orderId, orderStatus, jwt }));
  };

  const getErrorMessage = (error) => {
    if (!error) return null;
    if (typeof error === "string") return error;
    if (error.response?.data?.message) return error.response.data.message;
    return "An unexpected error occurred.";
  };

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title={name || "Quarry Orders"}
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />

        {error && (
          <Typography color="error" align="center" sx={{ p: 2 }}>
            {getErrorMessage(error)}
          </Typography>
        )}

        <TableContainer>
          <Table aria-label="quarry orders table">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Images</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Materials</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Allocated Lorries</TableCell>
                {!isDashboard && <TableCell>Status</TableCell>}
                {!isDashboard && (
                  <TableCell align="center">Update</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.length > 0 ? (
                orders.map((order, index) => (
                  <TableRow hover key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <AvatarGroup max={4}>
                        {order.items?.map((orderItem) => (
                          <Avatar
                            key={orderItem.id}
                            alt={orderItem.material?.name}
                            src={orderItem.material?.images?.[0]}
                          />
                        ))}
                      </AvatarGroup>
                    </TableCell>
                    <TableCell>{order.customer?.email || "N/A"}</TableCell>
                    <TableCell>
                      Ksh.{order.totalAmount?.toLocaleString() || "0"}
                    </TableCell>
                    <TableCell>
                      {order.items?.map((orderItem) => (
                        <Typography key={orderItem.id}>
                          {orderItem.material?.name}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      {order.items?.map((orderItem) => (
                        <Typography key={orderItem.id}>
                          {orderItem.quantity}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      {order.items?.map((orderItem) => (
                        <Typography key={orderItem.id}>
                          {orderItem.lorries ?? orderItem.allocatedLorries ?? 0}{" "}
                          {orderItem.lorries === 1 ? "lorry" : "lorries"}
                        </Typography>
                      ))}
                    </TableCell>
                    {!isDashboard && (
                      <TableCell>
                        <Chip
                          label={order.orderStatus}
                          color={
                            order.orderStatus === "PENDING"
                              ? "info"
                              : order.orderStatus === "DELIVERED"
                              ? "success"
                              : "secondary"
                          }
                        />
                      </TableCell>
                    )}
                    {!isDashboard && (
                      <TableCell align="center">
                        <Button
                          aria-controls={`status-menu-${order.id}`}
                          onClick={(e) =>
                            handleUpdateStatusMenuClick(e, index)
                          }
                        >
                          Update
                        </Button>
                        <Menu
                          anchorEl={anchorElArray[index]}
                          open={Boolean(anchorElArray[index])}
                          onClose={() => handleUpdateStatusMenuClose(index)}
                        >
                          {orderStatusOptions.map((option) => (
                            <MenuItem
                              key={option.value}
                              onClick={() =>
                                handleUpdateOrder(
                                  order.id,
                                  option.value,
                                  index
                                )
                              }
                            >
                              {option.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    {loading ? "Loading orders..." : "No orders found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default OrdersTable;





