import { api } from "../../../config/api";
import {
  createLorryRequest,
  createLorrySuccess,
  createLorryFailure,
  getAvailableLorriesRequest,
  getAvailableLorriesSuccess,
  getAvailableLorriesFailure,
  getLorriesRequest,
  getLorriesSuccess,
  getLorriesFailure,
  deleteLorryRequest,
  deleteLorrySuccess,
  deleteLorryFailure,
  searchLorryRequest,
  searchLorrySuccess,
  searchLorryFailure,
  updateLorryAvailabilityRequest,
  updateLorryAvailabilitySuccess,
  updateLorryAvailabilityFailure,
} from "./ActionCreators";


export const createLorry = ({ plateNumber, lorryName, description, images, quarryId, jwt }) => async (dispatch) => {
  dispatch(createLorryRequest());
  try {
    const { data } = await api.post(
      `/api/admin/lorries/add`,
      { plateNumber, lorryName, description, images, quarryId },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    dispatch(createLorrySuccess(data));
  } catch (error) {
    dispatch(createLorryFailure(error.response?.data?.message || error.message));
  }
};

export const getAvailableLorries = ({ jwt }) => async (dispatch) => {
  dispatch(getAvailableLorriesRequest());
  try {
    const { data } = await api.get(`/api/admin/lorries/available`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch(getAvailableLorriesSuccess(data));
  } catch (error) {
    dispatch(getAvailableLorriesFailure(error.response?.data?.message || error.message));
  }
};

export const getLorriesByQuarryId = ({ quarryId, jwt }) => async (dispatch) => {
  dispatch(getLorriesRequest());
  try {
    const { data } = await api.get(`/api/admin/lorries/quarry/${quarryId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch(getLorriesSuccess(data));
  } catch (error) {
    dispatch(getLorriesFailure(error.response?.data?.message || error.message));
  }
};

export const deleteLorry = ({ lorryId, jwt }) => async (dispatch) => {
  dispatch(deleteLorryRequest());
  try {
    await api.delete(`/api/admin/lorries/${lorryId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch(deleteLorrySuccess(lorryId));
  } catch (error) {
    dispatch(deleteLorryFailure(error.response?.data?.message || error.message));
  }
};

export const searchLorries = ({ plate, jwt }) => async (dispatch) => {
  dispatch(searchLorryRequest());
  try {
    const { data } = await api.get(`/api/admin/lorries/search`, {
      params: { plate },
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch(searchLorrySuccess(data));
  } catch (error) {
    dispatch(searchLorryFailure(error.response?.data?.message || error.message));
  }
};

export const updateLorryAvailability = ({ lorryId, available, jwt }) => async (dispatch) => {
  dispatch(updateLorryAvailabilityRequest());
  try {
    const { data } = await api.patch(
      `/api/admin/lorries/${lorryId}/availability`,
      null,
      {
        params: { available },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    dispatch(updateLorryAvailabilitySuccess(data));
  } catch (error) {
    dispatch(updateLorryAvailabilityFailure(error.response?.data?.message || error.message));
  }
};






