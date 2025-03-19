import axios, {
	AxiosInstance,
	InternalAxiosRequestConfig,
	AxiosResponse,
	AxiosError,
} from 'axios';
import Cookies from 'js-cookie';

const api: AxiosInstance = axios.create({
	baseURL: 'https://your-lib-api.vercel.app',
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = Cookies.get('auth-token');
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			Cookies.remove('auth-token');
			Cookies.remove('user');

			if (window.location.pathname !== '/login') {
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);

export default api;
