// Actions.js

import { api } from "../../../config/api";
import {
  createQuarryFailure,
  createQuarryRequest,
  createQuarrySuccess,
  deleteQuarryFailure,
  deleteQuarryRequest,
  deleteQuarrySuccess,
  getAllQuarriesFailure,
  getAllQuarriesRequest,
  getAllQuarriesSuccess,
  getQuarryByIdFailure,
  getQuarryByIdRequest,
  getQuarryByIdSuccess,
  updateQuarryFailure,
  updateQuarryRequest,
  updateQuarrySuccess,
} from "./ActionCreateros";

import {
  CREATE_CATEGORY_FAILURE,
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_EVENTS_FAILURE,
  CREATE_EVENTS_REQUEST,
  CREATE_EVENTS_SUCCESS,
  DELETE_EVENTS_FAILURE,
  DELETE_EVENTS_REQUEST,
  DELETE_EVENTS_SUCCESS,
  GET_ALL_EVENTS_FAILURE,
  GET_ALL_EVENTS_REQUEST,
  GET_ALL_EVENTS_SUCCESS,
  GET_QUARRIES_EVENTS_FAILURE,
  GET_QUARRIES_EVENTS_REQUEST,
  GET_QUARRIES_EVENTS_SUCCESS,
  GET_QUARRIES_CATEGORY_FAILURE,
  GET_QUARRIES_CATEGORY_REQUEST,
  GET_QUARRIES_CATEGORY_SUCCESS,
  GET_QUARRY_BY_USER_ID_FAILURE,
  GET_QUARRY_BY_USER_ID_REQUEST,
  GET_QUARRY_BY_USER_ID_SUCCESS,
  UPDATE_QUARRY_STATUS_FAILURE,
  UPDATE_QUARRY_STATUS_REQUEST,
  UPDATE_QUARRY_STATUS_SUCCESS,
} from "./ActionTypes";

export const getAllQuarriesAction = (token) => {
  return async (dispatch) => {
    dispatch(getAllQuarriesRequest());
    try {
      const { data } = await api.get("/api/quarries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(getAllQuarriesSuccess(data));
      console.log("all restaurant ", data);
    } catch (error) {
      dispatch(getAllQuarriesFailure(error));
    }
  };
};

export const getQuarryById = (reqData) => {
  return async (dispatch) => {
    dispatch(getQuarryByIdRequest());
    try {
      const response = await api.get(`api/quarries/${reqData.quarryId}`, {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      });
      dispatch(getQuarryByIdSuccess(response.data));
    } catch (error) {
      console.log("error",error)
      dispatch(getQuarryByIdFailure(error));
    }
  };
};

export const getQuarryByUserId = (jwt) => {
  return async (dispatch) => {
    dispatch({ type: GET_QUARRY_BY_USER_ID_REQUEST });
    try {
      const { data } = await api.get(`/api/admin/quarries/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
     // console.log("get quarry by user id ", data);
      dispatch({ type: GET_QUARRY_BY_USER_ID_SUCCESS, payload: data });
    } catch (error) {
      console.log("catch error ", error);
      dispatch({
        type: GET_QUARRY_BY_USER_ID_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const createQuarry = (reqData) => {
  console.log("token-----------", reqData.token);
  return async (dispatch) => {
    dispatch(createQuarryRequest());
    try {
      const { data } = await api.post(`/api/admin/quarries`, reqData.data, {
        headers: {
          Authorization: `Bearer ${reqData.token}`,
        },
      });
      dispatch(createQuarrySuccess(data));
      console.log("created quarry ", data);
    } catch (error) {
      console.log("catch error ", error);
      dispatch(createQuarryFailure(error));
    }
  };
};

export const updateQuarry = ({ quarryId, quarryData, jwt }) => {
  return async (dispatch) => {
    dispatch(updateQuarryRequest());

    try {
      const res = await api.put(
        `api/admin/quarry/${quarryId}`,
        quarryData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch(updateQuarrySuccess(res.data));
    } catch (error) {
      dispatch(updateQuarryFailure(error));
    }
  };
};
export const deleteQuarry = ({ quarryId, jwt }) => {
  return async (dispatch) => {
    dispatch(deleteQuarryRequest());

    try {
      const res = await api.delete(`/api/admin/quarry/${quarryId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("delete restaurant ", res.data);
      dispatch(deleteQuarrySuccess(quarryId));
    } catch (error) {
      console.log("catch error ", error);
      dispatch(deleteQuarryFailure(error));
    }
  };
};

export const updateQuarryStatus = ({ quarryId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_QUARRY_STATUS_REQUEST });

    try {
      const res = await api.put(
        `api/admin/quarries/${quarryId}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("ressssss ", res.data);
      dispatch({ type: UPDATE_QUARRY_STATUS_SUCCESS, payload: res.data });
    } catch (error) {
      console.log("error ",error)
      dispatch({ type: UPDATE_QUARRY_STATUS_FAILURE, payload: error });
    }
  };
};

export const createEventAction = ({ data, jwt,quarryId }) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_EVENTS_REQUEST });

    try {
      const res = await api.post(
        `api/admin/events/quarry/${quarryId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("create events ", res.data);
      dispatch({ type: CREATE_EVENTS_SUCCESS, payload: res.data });
    } catch (error) {
      console.log("catch - ", error);
      dispatch({ type: CREATE_EVENTS_FAILURE, payload: error });
    }
  };
};

export const getAllEvents = ({ jwt }) => {
  return async (dispatch) => {
    dispatch({ type: GET_ALL_EVENTS_REQUEST });

    try {
      const res = await api.get(`api/events`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("get all events ", res.data);
      dispatch({ type: GET_ALL_EVENTS_SUCCESS, payload: res.data });
    } catch (error) {
      dispatch({ type: GET_ALL_EVENTS_FAILURE, payload: error });
    }
  };
};

export const deleteEventAction = ({ eventId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_EVENTS_REQUEST });

    try {
      const res = await api.delete(`api/admin/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("DELETE events ", res.data);
      dispatch({ type: DELETE_EVENTS_SUCCESS, payload: eventId });
    } catch (error) {
      console.log("catch - ", error);
      dispatch({ type: DELETE_EVENTS_FAILURE, payload: error });
    }
  };
};

export const getQuarriesEvents = ({ quarryId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: GET_QUARRIES_EVENTS_REQUEST });

    try {
      const res = await api.get(
        `/api/admin/events/quarry/${quarryId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("get restaurants event ", res.data);
      dispatch({ type: GET_QUARRIES_EVENTS_SUCCESS, payload: res.data });
    } catch (error) {
      dispatch({ type: GET_QUARRIES_EVENTS_FAILURE, payload: error });
    }
  };
};

export const createCategoryAction = ({ reqData, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_CATEGORY_REQUEST });

    try {
      const res = await api.post(`api/admin/category`, reqData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("create category ", res.data);
      dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: res.data });
    } catch (error) {
      console.log("catch - ", error);
      dispatch({ type: CREATE_CATEGORY_FAILURE, payload: error });
    }
  };
};

export const getQuarriesCategory = ({ jwt,quarryId }) => {
  return async (dispatch) => {
    dispatch({ type: GET_QUARRIES_CATEGORY_REQUEST });
    try {
      const res = await api.get(`/api/category/quarry/${quarryId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("get restaurants category ", res.data);
      dispatch({ type: GET_QUARRIES_CATEGORY_SUCCESS, payload: res.data });
    } catch (error) {
      dispatch({ type: GET_QUARRIES_CATEGORY_FAILURE, payload: error });
    }
  };
};
