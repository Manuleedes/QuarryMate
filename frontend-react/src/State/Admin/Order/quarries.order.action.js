// actions.js

import {
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  GET_QUARRIES_ORDER_REQUEST,
  GET_QUARRIES_ORDER_SUCCESS,
  GET_QUARRIES_ORDER_FAILURE,
} from "./ActionType.js";
import { api } from "../../../config/api.js";

// ✅ Update Order Status Action
export const updateOrderStatus = ({ orderId, orderStatus, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });
    try {
      const { data } = await api.put(
        `/api/admin/orders/${orderId}/${orderStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("✅ Updated order: ", data);

      dispatch({
        type: UPDATE_ORDER_STATUS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error("❌ Error updating order:", error);
      dispatch({
        type: UPDATE_ORDER_STATUS_FAILURE,
        payload: error.response?.data || error.message,
      });
    }
  };
};

// ✅ Fetch Quarry Orders Action
export const fetchQuarriesOrder = ({ quarryId, orderStatus, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: GET_QUARRIES_ORDER_REQUEST });
    try {
      const { data } = await api.get(
        `/api/admin/order/quarry/${quarryId}`,
        {
          params: orderStatus ? { order_status: orderStatus } : {},
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("✅ Quarry orders fetched: ", data);

      // If backend returns { orders: [...] }, extract, else use data directly
      const orders = data.orders || data;

      dispatch({
        type: GET_QUARRIES_ORDER_SUCCESS,
        payload: orders,
      });
    } catch (error) {
      console.error("❌ Error fetching quarry orders:", error);
      dispatch({
        type: GET_QUARRIES_ORDER_FAILURE,
        payload: error.response?.data || error.message,
      });
    }
  };
};

