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
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quarryId } = useParams();
  const jwt = localStorage.getItem("jwt");

  const quarriesOrder = useSelector((store) => store.quarriesOrder) || {
    loading: false,
    orders: [],
    error: null,
  };

  const [anchorElArray, setAnchorElArray] = useState([]);

  useEffect(() => {
    if (jwt && quarryId) {
      dispatch(fetchQuarriesOrder({ quarryId, orderStatus: "", jwt }));
    }
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
          title={name || "Orders"}
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />

        {quarriesOrder.error && (
          <Typography color="error" align="center" sx={{ p: 2 }}>
            {getErrorMessage(quarriesOrder.error)}
          </Typography>
        )}

        <TableContainer>
          <Table aria-label="orders table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Materials</TableCell>
                <TableCell>Weight (Tonnes)</TableCell>
                <TableCell>Lorries Needed</TableCell>
                {!isDashboard && <TableCell>Status</TableCell>}
                {!isDashboard && (
                  <TableCell sx={{ textAlign: "center" }}>Update</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {quarriesOrder?.orders?.length > 0 ? (
                quarriesOrder.orders.map((item, index) => (
                  <TableRow hover key={item.id}>
                    <TableCell>{item?.id}</TableCell>

                    <TableCell>
                      <AvatarGroup max={4}>
                        {item.items?.map((orderItem) => (
                          <Avatar
                            key={orderItem.id}
                            alt={orderItem.material?.name}
                            src={orderItem.material?.images?.[0]}
                          />
                        ))}
                      </AvatarGroup>
                    </TableCell>

                    <TableCell>{item?.customer?.email || "N/A"}</TableCell>

                    <TableCell>
                      Ksh.{item?.totalAmount?.toLocaleString() || "0"}
                    </TableCell>

                    <TableCell>
                      {item.items?.map((orderItem) => (
                        <p key={orderItem.id}>{orderItem.material?.name}</p>
                      ))}
                    </TableCell>

                    <TableCell>
                      {item.items?.map((orderItem) => (
                        <p key={orderItem.id}>{orderItem.weight} T</p>
                      ))}
                    </TableCell>

                    <TableCell>
                      {item.items?.map((orderItem) => {
                        const lorries = Math.ceil(orderItem.weight / 18);
                        return (
                          <p key={orderItem.id}>
                            {lorries} lorr{lorries > 1 ? "ies" : "y"}
                          </p>
                        );
                      })}
                    </TableCell>

                    {!isDashboard && (
                      <TableCell>
                        <Chip
                          label={item?.orderStatus || "N/A"}
                          color={
                            item.orderStatus === "PENDING"
                              ? "info"
                              : item.orderStatus === "DELIVERED"
                              ? "success"
                              : "secondary"
                          }
                        />
                      </TableCell>
                    )}

                    {!isDashboard && (
                      <TableCell sx={{ textAlign: "center" }}>
                        <Button
                          aria-controls={`basic-menu-${item.id}`}
                          onClick={(e) => handleUpdateStatusMenuClick(e, index)}
                        >
                          Status
                        </Button>
                        <Menu
                          anchorEl={anchorElArray[index]}
                          open={Boolean(anchorElArray[index])}
                          onClose={() => handleUpdateStatusMenuClose(index)}
                        >
                          {orderStatusOptions.map((statusOption) => (
                            <MenuItem
                              key={statusOption.value}
                              onClick={() =>
                                handleUpdateOrder(
                                  item.id,
                                  statusOption.value,
                                  index
                                )
                              }
                            >
                              {statusOption.label}
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
                    {quarriesOrder.loading
                      ? "Loading orders..."
                      : "No orders found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={quarriesOrder?.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default OrdersTable;



