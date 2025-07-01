import { Button, Card } from "@mui/material";
import React from "react";

const OrderCard = ({order,status}) => {
  return (
    <Card className="flex justify-between items-center p-5 ">
      <div className="flex items-center space-x-5">
        <img
          className="h-16 w-16"
          src={order.material.images[0]}
          alt=""
        />
        <div>
          <p>{order.material.name}</p>
          <p className="text-gray-400">
  Ksh.{order.material?.price ?? order.totalPrice ?? "N/A"}
</p>
        </div>
      </div>
      <div>
        <Button className="cursor-not-allowed" variant="contained">{status}</Button>
      </div>
    </Card>
  );
};

export default OrderCard;
