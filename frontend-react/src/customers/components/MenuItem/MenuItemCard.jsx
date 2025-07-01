import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../../State/Customers/Cart/cart.action";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

const MenuItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState("");
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = async (e) => {
    const inputQuantity = parseFloat(e.target.value);
    setQuantity(e.target.value);

    if (inputQuantity && inputQuantity > 0) {
      setLoading(true);
      try {
        const res = await axios.post(
          "http://localhost:5454/api/customer/orders/calculate",
          {
            menuItemId: item.id,
            quantity: inputQuantity,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        setEstimate(res.data);
      } catch (err) {
        console.error("Estimation error", err);
        setEstimate(null);
      }
      setLoading(false);
    } else {
      setEstimate(null);
    }
  };

  const handleAddItemToCart = () => {
    if (!quantity || !estimate) return;

    const data = {
      token: localStorage.getItem("jwt"),
      cartItem: {
        menuItemId: item.id,
        quantity: parseFloat(quantity),
        price: estimate.totalPrice,
        lorries: estimate.lorriesRequired,
      },
    };

    dispatch(addItemToCart(data));
  };

  const availableQuantity = item.quantity ?? 0;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className="lg:flex items-center justify-between w-full">
          <div className="lg:flex items-center lg:space-x-5">
            <img
              className="w-[7rem] h-[7rem] object-cover"
              src={item.images?.[0]}
              alt={item.name}
            />
            <div className="space-y-1 lg:space-y-5">
              <p className="font-semibold text-xl">{item.name}</p>
              <p className="text-gray-400">{item.description}</p>
            </div>
          </div>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <div className="space-y-3 w-full">

          <Typography variant="body2" className="text-green-700 font-medium">
            Available: {availableQuantity}{" "}
            {item.pricingUnit === "TONNES" ? "Tonnes" : "Units"}
          </Typography>

          <TextField
            label={
              item.pricingUnit === "PIECE"
                ? "Enter number of pieces"
                : "Enter weight in tonnes"
            }
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            fullWidth
          />

          {loading && (
            <div className="flex justify-center">
              <CircularProgress size={24} />
            </div>
          )}

          {estimate && !loading && (
            <div className="bg-white shadow-md border border-gray-200 rounded-lg p-5 mt-4 space-y-3">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                💰 Price Estimate Breakdown
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Typography variant="body1" className="text-gray-700">
                  <strong>Unit:</strong> {estimate.unit}
                </Typography>
                <Typography variant="body1" className="text-gray-700">
                  <strong>Lorries Required:</strong> {estimate.lorriesRequired}
                </Typography>
                <Typography variant="body1" className="text-gray-700">
                  <strong>Material Cost:</strong>{" "}
                  <span className="text-green-700">
                    Ksh. {estimate.materialCost.toLocaleString()}
                  </span>
                </Typography>
                <Typography variant="body1" className="text-gray-700">
                  <strong>Transport Cost:</strong>{" "}
                  <span className="text-blue-700">
                    Ksh. {estimate.lorryCost.toLocaleString()}
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-700 col-span-full"
                >
                  <strong>Total Price:</strong>{" "}
                  <span className="text-purple-800 font-semibold text-lg">
                    Ksh. {estimate.totalPrice.toLocaleString()}
                  </span>
                </Typography>
              </div>
            </div>
          )}

          <Button
            fullWidth
            variant="contained"
            disabled={!item.available || !estimate || loading}
            onClick={handleAddItemToCart}
          >
            {item.available ? "Add To Cart" : "Out of Stock"}
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default MenuItemCard;


