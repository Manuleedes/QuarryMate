
import * as actionTypes from "./ActionType";

export const createLorryRequest = () => ({ type: actionTypes.CREATE_LORRY_REQUEST });
export const createLorrySuccess = (data) => ({ type: actionTypes.CREATE_LORRY_SUCCESS, payload: data });
export const createLorryFailure = (error) => ({ type: actionTypes.CREATE_LORRY_FAILURE, payload: error });

export const getAvailableLorriesRequest = () => ({ type: actionTypes.GET_AVAILABLE_LORRIES_REQUEST });
export const getAvailableLorriesSuccess = (data) => ({ type: actionTypes.GET_AVAILABLE_LORRIES_SUCCESS, payload: data });
export const getAvailableLorriesFailure = (error) => ({ type: actionTypes.GET_AVAILABLE_LORRIES_FAILURE, payload: error });

export const getLorriesRequest = () => ({ type: actionTypes.GET_LORRIES_BY_QUARRY_ID_REQUEST });
export const getLorriesSuccess = (data) => ({ type: actionTypes.GET_LORRIES_BY_QUARRY_ID_SUCCESS, payload: data });
export const getLorriesFailure = (error) => ({ type: actionTypes.GET_LORRIES_BY_QUARRY_ID_FAILURE, payload: error });

export const deleteLorryRequest = () => ({ type: actionTypes.DELETE_LORRY_REQUEST });
export const deleteLorrySuccess = (id) => ({ type: actionTypes.DELETE_LORRY_SUCCESS, payload: id });
export const deleteLorryFailure = (error) => ({ type: actionTypes.DELETE_LORRY_FAILURE, payload: error });

export const searchLorryRequest = () => ({ type: actionTypes.SEARCH_LORRY_REQUEST });
export const searchLorrySuccess = (data) => ({ type: actionTypes.SEARCH_LORRY_SUCCESS, payload: data });
export const searchLorryFailure = (error) => ({ type: actionTypes.SEARCH_LORRY_FAILURE, payload: error });

export const updateLorryAvailabilityRequest = () => ({ type: actionTypes.UPDATE_LORRY_AVAILABILITY_REQUEST });
export const updateLorryAvailabilitySuccess = (data) => ({ type: actionTypes.UPDATE_LORRY_AVAILABILITY_SUCCESS, payload: data });
export const updateLorryAvailabilityFailure = (error) => ({ type: actionTypes.UPDATE_LORRY_AVAILABILITY_FAILURE, payload: error });
