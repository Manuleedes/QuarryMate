import * as actionTypes from './ActionTypes';
// Create Quarry Actions
export const createQuarryRequest = () => ({
    type: actionTypes.CREATE_QUARRY_REQUEST,
  });
  
  export const createQuarrySuccess = (quarry) => ({
    type: actionTypes.CREATE_QUARRY_SUCCESS,
    payload: quarry,
  });
  
  export const createQuarryFailure = (error) => ({
    type: actionTypes.CREATE_QUARRY_FAILURE,
    payload: error,
  });

  // Get All Quarries Actions (similar structure for other actions)
export const getAllQuarriesRequest = () => ({
    type: actionTypes.GET_ALL_QUARRIES_REQUEST,
  });
  
  export const getAllQuarriesSuccess = (quarries) => ({
    type: actionTypes.GET_ALL_QUARRIES_SUCCESS,
    payload: quarries,
  });
  
  export const getAllQuarriesFailure = (error) => ({
    type: actionTypes.GET_ALL_QUARRIES_FAILURE,
    payload: error,
  });
  

  // Delete Quarry Actions
export const deleteQuarryRequest = () => ({
    type: actionTypes.DELETE_QUARRY_REQUEST,
  });
  
  export const deleteQuarrySuccess = (quarryId) => ({
    type: actionTypes.DELETE_QUARRY_SUCCESS,
    payload: quarryId,
  });
  
  export const deleteQuarryFailure = (error) => ({
    type: actionTypes.DELETE_QUARRY_FAILURE,
    payload: error,
  });


  // Update Quarry Actions
export const updateQuarryRequest = () => ({
    type: actionTypes.UPDATE_QUARRY_REQUEST,
  });
  
  export const updateQuarrySuccess = (updatedQuarry) => ({
    type: actionTypes.UPDATE_QUARRY_SUCCESS,
    payload: updatedQuarry,
  });
  
  export const updateQuarryFailure = (error) => ({
    type: actionTypes.UPDATE_QUARRY_FAILURE,
    payload: error,
  });

  export const getQuarryByIdRequest = () => ({
    type: actionTypes.GET_QUARRY_BY_ID_REQUEST,
  });
  
  export const getQuarryByIdSuccess = (restaurant) => ({
    type: actionTypes.GET_QUARRY_BY_ID_SUCCESS,
    payload: restaurant,
  });
  
  export const getQuarryByIdFailure = (error) => ({
    type: actionTypes.GET_QUARRY_BY_ID_FAILURE,
    payload: error,
  });
  