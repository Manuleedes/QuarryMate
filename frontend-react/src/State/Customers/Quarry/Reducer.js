// Reducers.js
import * as actionTypes from "./ActionTypes";

const initialState = {
  quarries: [],
  usersQuarry: null,
  quarry: null,
  loading: false,
  error: null,
  events: [],
  quarriesEvents: [],
  categories: [],
};

const quarryReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_QUARRY_REQUEST:
    case actionTypes.GET_ALL_QUARRIES_REQUEST:
    case actionTypes.DELETE_QUARRY_REQUEST:
    case actionTypes.UPDATE_QUARRY_REQUEST:
    case actionTypes.GET_QUARRY_BY_ID_REQUEST:
    case actionTypes.CREATE_CATEGORY_REQUEST:
    case actionTypes.GET_QUARRIES_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.CREATE_QUARRY_SUCCESS:
      return {
        ...state,
        loading: false,
        usersQuarry:action.payload
      };
    case actionTypes.GET_ALL_QUARRIES_SUCCESS:
      return {
        ...state,
        loading: false,
        quarries: action.payload,
      };
    case actionTypes.GET_QUARRY_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        quarry: action.payload,
      };
    case actionTypes.GET_QUARRY_BY_USER_ID_SUCCESS:
    case actionTypes.UPDATE_QUARRY_STATUS_SUCCESS:
    case actionTypes.UPDATE_QUARRY_SUCCESS:
      return {
        ...state,
        loading: false,
        usersQuarry: action.payload,
      };

    case actionTypes.DELETE_QUARRY_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        quarries: state.quarries.filter(
          (item) => item.id !== action.payload
        ),
        usersQuarry: state.usersQuarry.filter(
          (item) => item.id !== action.payload
        ),
      };

    case actionTypes.CREATE_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        events: [...state.events, action.payload],
        quarriesEvents: [...state.quarriesEvents, action.payload],
      };
    case actionTypes.GET_ALL_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        events: action.payload,
      };
    case actionTypes.GET_QUARRIES_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        quarriesEvents: action.payload,
      };
    case actionTypes.DELETE_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        events: state.events.filter((item) => item.id !== action.payload),
        quarriesEvents: state.quarriesEvents.filter(
          (item) => item.id !== action.payload
        ),
      };
    case actionTypes.CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: [...state.categories, action.payload],
      };
    case actionTypes.GET_QUARRIES_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload,
      };
    case actionTypes.CREATE_QUARRY_FAILURE:
    case actionTypes.GET_ALL_QUARRIES_FAILURE:
    case actionTypes.DELETE_QUARRY_FAILURE:
    case actionTypes.UPDATE_QUARRY_FAILURE:
    case actionTypes.GET_QUARRY_BY_ID_FAILURE:
    case actionTypes.CREATE_EVENTS_FAILURE:
    case actionTypes.CREATE_CATEGORY_FAILURE:
    case actionTypes.GET_QUARRIES_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default quarryReducer;
