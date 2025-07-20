import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";

/** Bootstrap CSS */
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

/** Custom CSS */
import "./style/index.css";
import "./style/myStyle-animations.css";
import "./style/myStyle-sizes.css";
import "./style/myStyle-responsive.css";
import "./style/myStyle-other.css";

/** Redux */
import { legacy_createStore as createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./redux/rootReducer";
const store = createStore(reducer);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</StrictMode>
);
