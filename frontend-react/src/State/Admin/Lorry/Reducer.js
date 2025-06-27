import * as actionTypes from './ActionType';

const initialState = {
  lorries: [],
  loading: false,
  error: null,
};

const lorryReducer = (state = initialState, action) => {
  switch (action.type) {
    // 🟡 Requests
    case actionTypes.CREATE_LORRY_REQUEST:
    case actionTypes.GET_LORRIES_BY_QUARRY_ID_REQUEST:
    case actionTypes.GET_AVAILABLE_LORRIES_REQUEST:
    case actionTypes.DELETE_LORRY_REQUEST:
    case actionTypes.SEARCH_LORRY_REQUEST:
    case actionTypes.UPDATE_LORRY_AVAILABILITY_REQUEST:
      return { ...state, loading: true, error: null };

    // 🟢 Successes
    case actionTypes.CREATE_LORRY_SUCCESS:
      return { ...state, loading: false, lorries: [...state.lorries, action.payload] };

    case actionTypes.GET_LORRIES_BY_QUARRY_ID_SUCCESS:
    case actionTypes.GET_AVAILABLE_LORRIES_SUCCESS:
    case actionTypes.SEARCH_LORRY_SUCCESS:
      return { ...state, loading: false, lorries: action.payload };

    case actionTypes.DELETE_LORRY_SUCCESS:
      return {
        ...state,
        loading: false,
        lorries: state.lorries.filter((lorry) => lorry.id !== action.payload),
      };

    case actionTypes.UPDATE_LORRY_AVAILABILITY_SUCCESS:
      return {
        ...state,
        loading: false,
        lorries: state.lorries.map((lorry) =>
          lorry.id === action.payload.id ? action.payload : lorry
        ),
      };

    // 🔴 Failures
    case actionTypes.CREATE_LORRY_FAILURE:
    case actionTypes.GET_LORRIES_BY_QUARRY_ID_FAILURE:
    case actionTypes.GET_AVAILABLE_LORRIES_FAILURE:
    case actionTypes.DELETE_LORRY_FAILURE:
    case actionTypes.SEARCH_LORRY_FAILURE:
    case actionTypes.UPDATE_LORRY_AVAILABILITY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default lorryReducer;


