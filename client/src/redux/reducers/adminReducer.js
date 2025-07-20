import { combineReducers } from "redux";

const initialState = {
	categories: [], // [{ id, title, totalPurchased, products: [{ id, title, category: { id }, description, price, picLink, inStock, purchasedQuantity }] }]
	users: [], // [{ id, fullName, username, allowOthers, role, joinedAt, totalPurchased, products: [{ id, title, category: { id }, description, price, picLink, inStock, purchasedQuantity }] }]
	products: [], // [{ id, title, category: { id }, description, price, picLink, inStock, totalPurchased, users: [{ id, fullName, username, allowOthers, role, joinedAt, purchasedQuantity }] }]
};

function categoryReducer(state = initialState.categories, action) {
	switch (action.type) {
		case "SET_CATEGORIES":
			return action.payload;

		case "ADD_CATEGORY":
			if (state.some((category) => category.id === action.payload.id)) return state;
			return [...state, action.payload];

		case "UPDATE_CATEGORY":
			return state.map((category) => (category.id === action.payload.id ? { ...category, ...action.payload } : category));

		case "DELETE_CATEGORY":
			return state.filter((category) => category.id !== action.payload.id);

		default:
			return state;
	}
}

function usersReducer(state = initialState.users, action) {
	switch (action.type) {
		case "SET_USERS":
			return action.payload;

		default:
			return state;
	}
}

function productsReducer(state = initialState.products, action) {
	switch (action.type) {
		case "SET_PRODUCTS":
			return action.payload;

		case "ADD_PRODUCT":
			if (state.some((product) => product.id === action.payload.id)) return state;
			return [...state, action.payload];

		case "UPDATE_PRODUCT":
			return state.map((product) => (product.id === action.payload.id ? { ...product, ...action.payload } : product));

		case "DELETE_PRODUCT":
			return state.filter((product) => product.id !== action.payload.id);

		default:
			return state;
	}
}

const rootReducer = combineReducers({
	categories: categoryReducer,
	users: usersReducer,
	products: productsReducer,
});

export default rootReducer;
