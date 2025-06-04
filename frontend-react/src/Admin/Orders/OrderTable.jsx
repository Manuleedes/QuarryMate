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
const orderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
];

// useEffect(() => {
//   dispatch(fetchQuarriesOrder(jwt));
// }, [dispatch, jwt]);

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
  {quarriesOrder?.orders?.map((item, index) => (
    <TableRow hover key={item.id}>
      <TableCell>{item?.id}</TableCell>

      <TableCell>
        <AvatarGroup max={4}>
          {item.items.map((orderItem) => (
            <Avatar
              key={orderItem.id}
              alt={orderItem.material.name}
              src={orderItem.material?.images[0]}
            />
          ))}
        </AvatarGroup>
      </TableCell>

      <TableCell>{item?.customer.email}</TableCell>
      <TableCell>Ksh.{item?.totalAmount.toLocaleString()}</TableCell>

      <TableCell>
        {item.items.map((orderItem) => (
          <p key={orderItem.id}>{orderItem.material?.name}</p>
        ))}
      </TableCell>

      <TableCell>
        {item.items.map((orderItem) => (
          <p key={orderItem.id}>{orderItem.weight} T</p>
        ))}
      </TableCell>

      <TableCell>
        {item.items.map((orderItem) => (
          <p key={orderItem.id}>
            {Math.ceil(orderItem.weight / 18)} lorry
            {Math.ceil(orderItem.weight / 18) > 1 ? "ies" : ""}
          </p>
        ))}
      </TableCell>

      {!isDashboard && (
        <TableCell>
          <Chip
            label={item?.orderStatus}
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
            {orderStatus.map((s) => (
              <MenuItem
                key={s.value}
                onClick={() => handleUpdateOrder(item.id, s.value, index)}
              >
                {s.label}
              </MenuItem>
            ))}
          </Menu>
        </TableCell>
      )}
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
