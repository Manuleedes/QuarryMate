import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import thunk from "redux-thunk";
import authReducer from "../Authentication/Reducer";
import quarryReducer from "../Customers/Quarry/Reducer";
import menuItemReducer from "../Customers/Menu/Reducer";
import cartReducer from "../Customers/Cart/Reducer";
import { orderReducer } from "../Customers/Orders/order.reducer";
// import quarriesOrderReducer from "../Admin/Order/quarries.order.reducer";
import superAdminReducer from "../SuperAdmin/superAdmin.reducer";




const rootReducer=combineReducers({

    auth:authReducer,
    quarry:quarryReducer,
    menu:menuItemReducer,
    cart:cartReducer,
    order:orderReducer,

    // admin
    // quarriesOrder:quarriesOrderReducer,
    // ingredients:ingredientReducer,

    // super admin
    superAdmin:superAdminReducer
})

export const store=legacy_createStore(rootReducer,applyMiddleware(thunk))