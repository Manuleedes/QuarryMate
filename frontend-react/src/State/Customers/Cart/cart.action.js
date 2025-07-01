import { api } from "../../../config/api";
import {
  findCartFailure,
  findCartRequest,
  findCartSuccess,
  getAllCartItemsFailure,
  getAllCartItemsRequest,
  getAllCartItemsSuccess,
} from "./ActionCreators";
import {
  ADD_ITEM_TO_CART_FAILURE,
  ADD_ITEM_TO_CART_REQUEST,
  ADD_ITEM_TO_CART_SUCCESS,
  CLEARE_CART_FAILURE,
  CLEARE_CART_REQUEST,
  CLEARE_CART_SUCCESS,
  REMOVE_CARTITEM_FAILURE,
  REMOVE_CARTITEM_REQUEST,
  REMOVE_CARTITEM_SUCCESS,
  UPDATE_CARTITEM_FAILURE,
  UPDATE_CARTITEM_REQUEST,
  UPDATE_CARTITEM_SUCCESS,
} from "./ActionTypes";

import { getMenuItemsByQuarryId } from "../Menu/menu.action";
import { store } from "../../Store/store"; // import if not auto-injected

// Utility to refetch updated menu items after cart mutation
const refreshMaterials = async () => {
  const state = store.getState();
  const { quarry, auth } = state;
  const jwt = auth.jwt || localStorage.getItem("jwt");

  if (quarry.usersQuarry) {
    await store.dispatch(
      getMenuItemsByQuarryId({
        quarryId: quarry.usersQuarry.id,
        jwt,
        materialCategory: "",
      })
    );
  }
};

export const findCart = (token) => {
  return async (dispatch) => {
    dispatch(findCartRequest());
    try {
      const response = await api.get(`/api/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(findCartSuccess(response.data));
    } catch (error) {
      dispatch(findCartFailure(error));
    }
  };
};

export const getAllCartItems = (reqData) => {
  return async (dispatch) => {
    dispatch(getAllCartItemsRequest());
    try {
      const response = await api.get(`/api/carts/${reqData.cartId}/items`, {
        headers: { Authorization: `Bearer ${reqData.token}` },
      });
      dispatch(getAllCartItemsSuccess(response.data));
    } catch (error) {
      dispatch(getAllCartItemsFailure(error));
    }
  };
};

export const addItemToCart = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_ITEM_TO_CART_REQUEST });
    try {
      const { data } = await api.put(`/api/cart/add`, reqData.cartItem, {
        headers: { Authorization: `Bearer ${reqData.token}` },
      });
      console.log("Added item to cart: ", data);

      dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: data });

      // Refresh material quantities in real-time
      await refreshMaterials();
    } catch (error) {
      console.error("Add to cart error: ", error);
      dispatch({ type: ADD_ITEM_TO_CART_FAILURE, payload: error.message });
    }
  };
};

export const updateCartItem = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_CARTITEM_REQUEST });
    try {
      const { data } = await api.put(`/api/cart-item/update`, reqData.data, {
        headers: { Authorization: `Bearer ${reqData.jwt}` },
      });
      console.log("Updated cart item: ", data);

      dispatch({ type: UPDATE_CARTITEM_SUCCESS, payload: data });

      // Refresh material quantities
      await refreshMaterials();
    } catch (error) {
      console.error("Update cart item error: ", error);
      dispatch({ type: UPDATE_CARTITEM_FAILURE, payload: error.message });
    }
  };
};

export const removeCartItem = ({ cartItemId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: REMOVE_CARTITEM_REQUEST });
    try {
      await api.delete(`/api/cart-item/${cartItemId}/remove`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("Removed cart item ID: ", cartItemId);

      dispatch({ type: REMOVE_CARTITEM_SUCCESS, payload: cartItemId });

      // Refresh material quantities
      await refreshMaterials();
    } catch (error) {
      console.error("Remove cart item error: ", error);
      dispatch({ type: REMOVE_CARTITEM_FAILURE, payload: error.message });
    }
  };
};

export const clearCartAction = () => {
  return async (dispatch) => {
    dispatch({ type: CLEARE_CART_REQUEST });
    try {
      const { data } = await api.put(
        `/api/cart/clear`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );
      console.log("Cleared cart: ", data);

      dispatch({ type: CLEARE_CART_SUCCESS, payload: data });

      // Refresh material quantities
      await refreshMaterials();
    } catch (error) {
      console.error("Clear cart error: ", error);
      dispatch({ type: CLEARE_CART_FAILURE, payload: error.message });
    }
  };
};


