import { useMemo } from "react";
import axios from "axios";

const SERVER_BASE_URL = "http://localhost:3000";

function useAxiosWithToken(token) {
	return useMemo(
		() =>
			axios.create({
				baseURL: SERVER_BASE_URL,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		[token]
	);
}

export { useAxiosWithToken, SERVER_BASE_URL };
