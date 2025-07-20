import { combineReducers } from "redux";

const initialState = {
	loggedUser: null, // { id, fullName, username, allowOthers, role, joinedAt }
	token: "",
};

function tokenReducer(state = initialState.token, action) {
	switch (action.type) {
		case "SET_TOKEN":
			return action.payload;
		default:
			return state;
	}
}

function authReducer(state = initialState.loggedUser, action) {
	switch (action.type) {
		case "SET_LOGGED_USER":
			return action.payload;
		case "UPDATE_LOGGED_USER":
			return { ...state, ...action.payload };
		default:
			return state;
	}
}

const commonReducer = combineReducers({
	token: tokenReducer,
	loggedUser: authReducer,
});

export default commonReducer;
