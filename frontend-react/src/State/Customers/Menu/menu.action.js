import { api } from "../../../config/api";
import {
  createMenuItemFailure,
  createMenuItemRequest,
  createMenuItemSuccess,
  deleteMenuItemFailure,
  deleteMenuItemRequest,
  deleteMenuItemSuccess,
  getMenuItemsByQuarryIdFailure,
  getMenuItemsByQuarryIdRequest,
  getMenuItemsByQuarryIdSuccess,
} from "./ActionCreators";

import {
  DELETE_MENU_ITEM_FAILURE,
  DELETE_MENU_ITEM_REQUEST,
  DELETE_MENU_ITEM_SUCCESS,
  SEARCH_MENU_ITEM_FAILURE,
  SEARCH_MENU_ITEM_REQUEST,
  SEARCH_MENU_ITEM_SUCCESS,
  UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE,
  UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST,
  UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS,
} from "./ActionType";

/**
 * Create a new material item
 */
export const createMenuItem = ({ menu, jwt }) => {
  return async (dispatch) => {
    dispatch(createMenuItemRequest());
    try {
      // Build payload exactly matching backend CreateMaterialRequest
      const payload = {
        name: menu.name,
        description: menu.description,
        price: Number(menu.pricePerUnit), // backend expects `price`
        quantity: Number(menu.quantity),
        images: menu.images || [],
        quarryId: menu.quarryId,
        pricingUnit: menu.pricingUnit?.toUpperCase(), // "TONNE" or "PIECE"
        category: menu.category || null, // Send as object or null
      };

      console.log("Sending payload to backend:", payload);

      const { data } = await api.post("api/admin/material", payload, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("Created menu item:", data);
      dispatch(createMenuItemSuccess(data));
    } catch (error) {
      console.error("createMenuItem error:", error);
      if (error.response) {
        console.error("Backend response data:", error.response.data);
        console.error("Status:", error.response.status);
      }
      dispatch(createMenuItemFailure(error));
    }
  };
};

/**
 * Get all menu items by quarry ID
 */
export const getMenuItemsByQuarryId = (reqData) => {
  return async (dispatch) => {
    dispatch(getMenuItemsByQuarryIdRequest());
    try {
      const { data } = await api.get(
        `/api/material/quarry/${reqData.quarryId}?vegetarian=${reqData.vegetarian}&nonveg=${reqData.nonveg}&seasonal=${reqData.seasonal}&material_category=${reqData.materialCategory}`,
        {
          headers: {
            Authorization: `Bearer ${reqData.jwt}`,
          },
        }
      );
      console.log("Menu items by quarry:", data);
      dispatch(getMenuItemsByQuarryIdSuccess(data));
    } catch (error) {
      console.error("getMenuItemsByQuarryId error:", error);
      dispatch(getMenuItemsByQuarryIdFailure(error));
    }
  };
};

/**
 * Search menu item by keyword
 */
export const searchMenuItem = ({ keyword, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_MENU_ITEM_REQUEST });
    try {
      const { data } = await api.get(`api/material/search?name=${keyword}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("Search result:", data);
      dispatch({ type: SEARCH_MENU_ITEM_SUCCESS, payload: data });
    } catch (error) {
      console.error("searchMenuItem error:", error);
      dispatch({ type: SEARCH_MENU_ITEM_FAILURE });
    }
  };
};

/**
 * Get all ingredients of menu item by quarry ID
 */
export const getAllIngredientsOfMenuItem = (reqData) => {
  return async (dispatch) => {
    dispatch(getMenuItemsByQuarryIdRequest());
    try {
      const { data } = await api.get(`api/material/quarry/${reqData.quarryId}`, {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      });
      console.log("Ingredients by quarry:", data);
      dispatch(getMenuItemsByQuarryIdSuccess(data));
    } catch (error) {
      console.error("getAllIngredientsOfMenuItem error:", error);
      dispatch(getMenuItemsByQuarryIdFailure(error));
    }
  };
};

/**
 * Update menu item availability (toggle)
 */
export const updateMenuItemsAvailability = ({ materialId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST });
    try {
      const { data } = await api.put(`/api/admin/material/${materialId}`, {}, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("Updated material availability:", data);
      dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS, payload: data });
    } catch (error) {
      console.error("updateMenuItemsAvailability error:", error);
      dispatch({
        type: UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE,
        payload: error,
      });
    }
  };
};

/**
 * Delete a material item
 */
export const deleteMaterialAction = ({ materialId, jwt }) => async (dispatch) => {
  dispatch({ type: DELETE_MENU_ITEM_REQUEST });
  try {
    const { data } = await api.delete(`/api/admin/material/${materialId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log("Deleted material:", data);
    dispatch({ type: DELETE_MENU_ITEM_SUCCESS, payload: materialId });
  } catch (error) {
    console.error("deleteMaterialAction error:", error);
    dispatch({ type: DELETE_MENU_ITEM_FAILURE, payload: error });
  }
};

