import React from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { removeCartItem } from "../../../State/Customers/Cart/cart.action";

const CartItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { auth } = useSelector((store) => store);

  const handleRemoveCartItem = () => {
    dispatch(removeCartItem({ cartItemId: item.id, jwt: auth.jwt || jwt }));
  };

  return (
    <div className="px-5 py-3 border-b">
      <div className="lg:flex items-center lg:space-x-5">
        <div>
          <img
            className="w-[5rem] h-[5rem] object-cover rounded"
            src={item.material.images[0]}
            alt={item.material.name}
          />
        </div>

        <div className="flex items-center justify-between lg:w-full mt-2 lg:mt-0">
          <div className="space-y-1 lg:space-y-2 w-full">
            <p className="font-medium">{item.material.name}</p>

            <p className="text-sm text-gray-500">
              Tonnes Ordered:{" "}
              <span className="font-semibold">{item.quantity}</span>
            </p>

            <p className="text-sm text-gray-500">
              Total Price:{" "}
              <span className="font-semibold">
                Ksh.{" "}
                {item.totalPrice !== undefined && item.totalPrice !== null
                  ? item.totalPrice.toLocaleString()
                  : "N/A"}
              </span>
            </p>
          </div>

          <IconButton
            onClick={handleRemoveCartItem}
            color="error"
            className="ml-4"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
