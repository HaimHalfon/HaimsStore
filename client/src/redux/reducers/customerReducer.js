import { combineReducers } from "redux";

const initialState = {
	categories: [], // [{ id, title }]
	products: [], // [{ id, title, category: { id }, description, price, picLink, inStock, totalPurchased, users: [{ id, fullName, username, allowOthers, role, joinedAt, purchasedQuantity }] }]
	orders: [], // [{ id, user: { id }, totalPrice, orderDate, products: [{ product: { id, title, category: { id }, description, price, picLink, inStock }, priceAtPurchase, purchasedQuantity }] }]
	cartItems: [], // [{ id, title, price, inStock, quantity, totalPrice }]
};

function categoryReducer(state = initialState.categories, action) {
	switch (action.type) {
		case "SET_CATEGORIES":
			return action.payload;

		default:
			return state;
	}
}

function productsReducer(state = initialState.products, action) {
	switch (action.type) {
		case "SET_PRODUCTS":
			return action.payload;

		default:
			return state;
	}
}

function ordersReducer(state = initialState.orders, action) {
	switch (action.type) {
		case "SET_ORDERS":
			return action.payload;

		default:
			return state;
	}
}

function cartItemsReducer(state = initialState.cartItems, action) {
	switch (action.type) {
		case "SET_CART_ITEMS":
			return action.payload;

		case "INC_CART_ITEM": {
			const { id, title, price, inStock } = action.payload;
			const itemInd = state.findIndex((item) => item.id === id);

			if (itemInd === -1) return [...state, { id, title, price, inStock, quantity: 1, totalPrice: price * 1 }];

			const item = state[itemInd];

			return [
				...state.slice(0, itemInd),
				{
					...item,
					quantity: item.quantity + 1,
					totalPrice: price * (item.quantity + 1),
				},
				...state.slice(itemInd + 1),
			];
		}

		case "DEC_CART_ITEM": {
			const { id, price } = action.payload;
			const itemInd = state.findIndex((item) => item.id === id);

			if (itemInd === -1) return state;

			const item = state[itemInd];

			if (item.quantity <= 1) return [...state.slice(0, itemInd), ...state.slice(itemInd + 1)];

			return [
				...state.slice(0, itemInd),
				{
					...item,
					quantity: item.quantity - 1,
					totalPrice: price * (item.quantity - 1),
				},
				...state.slice(itemInd + 1),
			];
		}

		case "DELETE_CART_ITEM": {
			const itemInd = state.findIndex((item) => item.id === action.payload.id);
			if (itemInd === -1) return state;
			return [...state.slice(0, itemInd), ...state.slice(itemInd + 1)];
		}

		default:
			return state;
	}
}

const rootReducer = combineReducers({
	categories: categoryReducer,
	products: productsReducer,
	orders: ordersReducer,
	cartItems: cartItemsReducer,
});

export default rootReducer;
