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
// import {
//   confirmOrder,
//   deleteOrder,
//   deliveredOrder,
//   getOrders,
//   shipOrder,
// } from "../../state/Admin/Order/Action";

const orderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
];

const OrdersTable = ({ isDashboard, name }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ status: "", sort: "" });
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { quarriesOrder } = useSelector((store) => store);
  const [anchorElArray, setAnchorElArray] = useState([]);
  const { id } = useParams();

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
    dispatch(updateOrderStatus({ orderId, orderStatus,jwt }));
  };

  // console.log("restaurants orders store ", restaurantsOrder)

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title={name}
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />
        <TableContainer>
          <Table sx={{}} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
              <TableCell>Id</TableCell>
                <TableCell>Image</TableCell>
                {/* {!isDashboard && <TableCell>Title</TableCell>} */}
                <TableCell>Customer</TableCell>
                <TableCell>Price</TableCell>
             
                <TableCell>Name</TableCell>
                {!isDashboard && <TableCell>Ingredients</TableCell>}
                {!isDashboard &&<TableCell>Status</TableCell>}
                {!isDashboard && (
                  <TableCell sx={{ textAlign: "center" }}>Update</TableCell>
                )}
                {/* {!isDashboard && (
                  <TableCell sx={{ textAlign: "center" }}>Delete</TableCell>
                )} */}
              </TableRow>
            </TableHead>
            <TableBody>
              { quarriesOrder && quarriesOrder.orders
                ?.slice(0, isDashboard ? 7 : quarriesOrder.orders.length)
                .map((item, index) => (
                  <TableRow
                    className="cursor-pointer"
                    hover
                    key={item.id}
                    sx={{
                      "&:last-of-type td, &:last-of-type th": { border: 0 },
                    }}
                  >
                    <TableCell>{item?.id}</TableCell>
                    <TableCell sx={{}}>
                      <AvatarGroup max={4} sx={{ justifyContent: "start" }}>
                        {item.items.map((orderItem) => (
                          <Avatar
                            alt={orderItem.material.name}
                            src={orderItem.material?.images[0]}
                          />
                        ))}
                      </AvatarGroup>{" "}
                    </TableCell>

                    <TableCell sx={{}}>
                      {item?.customer.email}
                    </TableCell>

                    <TableCell>₹{item?.totalAmount}</TableCell>
                    
                    <TableCell className="">
                      {item.items.map((orderItem) => (
                        <p>
                          {orderItem.material?.name}
                        </p>
                      ))}
                    </TableCell>
                  {!isDashboard &&  <TableCell className="space-y-2">
                      {item.items.map((orderItem) =>
                      <div className="flex gap-1 flex-wrap">
                       { orderItem.ingredients?.map((ingre) => (
                          <Chip label={ingre} />
                        ))}
                      </div>
                        
                      )}
                    </TableCell>}
                    {!isDashboard &&<TableCell className="text-white">
                      <Chip
                        sx={{
                          color: "white !important",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                        label={item?.orderStatus}
                        size="small"
                        color={
                          item.orderStatus === "PENDING"
                            ? "info"
                            : item?.orderStatus === "DELIVERED"
                            ? "success"
                            : "secondary"
                        }
                        className="text-white"
                      />
                    </TableCell>}
                    {!isDashboard && (
                      <TableCell
                        sx={{ textAlign: "center" }}
                        className="text-white"
                      >
                        <div>
                          <Button
                            id={`basic-button-${item?.id}`}
                            aria-controls={`basic-menu-${item.id}`}
                            aria-haspopup="true"
                            aria-expanded={Boolean(anchorElArray[index])}
                            onClick={(event) =>
                              handleUpdateStatusMenuClick(event, index)
                            }
                          >
                            Status
                          </Button>
                          <Menu
                            id={`basic-menu-${item?.id}`}
                            anchorEl={anchorElArray[index]}
                            open={Boolean(anchorElArray[index])}
                            onClose={() => handleUpdateStatusMenuClose(index)}
                            MenuListProps={{
                              "aria-labelledby": `basic-button-${item.id}`,
                            }}
                          >
                            {orderStatus.map((s) => (
                              <MenuItem
                                onClick={() =>
                                  handleUpdateOrder(item.id, s.value, index)
                                }
                              >
                                {s.label}
                              </MenuItem>
                            ))}
                          </Menu>
                        </div>
                      </TableCell>
                    )}
                    {/* {!isDashboard && (
                    <TableCell
                      sx={{ textAlign: "center" }}
                      className="text-white"
                    >
                      <Button
                        onClick={() => handleDeleteOrder(item._id)}
                        variant="text"
                      >
                        delete
                      </Button>
                    </TableCell>
                  )} */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={quarriesOrder && quarriesOrder.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default OrdersTable;
