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

// localhost:5454/api/admin/ingredients/food/16

export const createMenuItem = ({menu,jwt}) => {
  return async (dispatch) => {
    dispatch(createMenuItemRequest());
    try {
      const { data } = await api.post("api/admin/material", menu,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("created menu ", data);
      dispatch(createMenuItemSuccess(data));
    } catch (error) {
      console.log("catch error ", error);
      dispatch(createMenuItemFailure(error));
    }
  };
};

export const getMenuItemsByQuarryId = (reqData) => {
  return async (dispatch) => {
    dispatch(getMenuItemsByQuarryIdRequest());
    try {
      const { data } = await api.get(
        `/api/material/quarry/${reqData.quarryId}?vegetarian=${reqData.vegetarian}&nonveg=${reqData.nonveg}
        &seasonal=${reqData.seasonal}&material_category=${reqData.materialCategory}`,
        {
          headers: {
            Authorization: `Bearer ${reqData.jwt}`,
          },
        }
      );
      console.log("menu item by quarries ", data);
      dispatch(getMenuItemsByQuarryIdSuccess(data));
    } catch (error) {
      dispatch(getMenuItemsByQuarryIdFailure(error));
    }
  };
};

export const searchMenuItem = ({keyword,jwt}) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_MENU_ITEM_REQUEST });
    try {
      const { data } = await api.get(`api/material/search?name=${keyword}`,{
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("data ----------- ", data);
      dispatch({ type: SEARCH_MENU_ITEM_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: SEARCH_MENU_ITEM_FAILURE });
    }
  };
};

export const getAllIngredientsOfMenuItem = (reqData) => {
  return async (dispatch) => {
    dispatch(getMenuItemsByQuarryIdRequest());
    try {
      const { data } = await api.get(
        `api/material/quarry/${reqData.quarryId}`,
        {
          headers: {
            Authorization: `Bearer ${reqData.jwt}`,
          },
        }
      );
      console.log("menu item by quarries ", data);
      dispatch(getMenuItemsByQuarryIdSuccess(data));
    } catch (error) {
      dispatch(getMenuItemsByQuarryIdFailure(error));
    }
  };
};

export const updateMenuItemsAvailability = ({materialId,jwt}) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST });
    try {
      const { data } = await api.put(`/api/admin/material/${materialId}`, {},{
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("update menuItems Availability ", data);
      dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS, payload: data });
    } catch (error) {
      console.log("error ",error)
      dispatch({
        type: UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE,
        payload: error,
      });
    }
};
};

export const deleteMaterialAction = ({materialId,jwt}) => async (dispatch) => {
  dispatch({ type: DELETE_MENU_ITEM_REQUEST });
  try {
    const { data } = await api.delete(`/api/admin/material/${materialId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log("delete material ", data);
    dispatch({ type: DELETE_MENU_ITEM_SUCCESS, payload: materialId });
  } catch (error) {
    dispatch({ type: DELETE_MENU_ITEM_FAILURE, payload: error });
  }
};
