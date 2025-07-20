import { combineReducers } from "redux";
import adminReducer from "./reducers/adminReducer";
import customerReducer from "./reducers/customerReducer";
import commonReducer from "./reducers/commonReducer";

const rootReducer = combineReducers({
	admin: adminReducer,
	customer: customerReducer,
	common: commonReducer,
});

export default rootReducer;
