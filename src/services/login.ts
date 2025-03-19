import { AxiosError } from 'axios';
import api from './axios';
import Cookies from 'js-cookie';

interface Login {
	email: string;
	password: string;
}

interface Response {
	id: string;
	name: string;
	email: string;
	access_token: string;
}

export default async function login(dataLogin: Login): Promise<Response> {
	try {
		const { data } = await api.post<Response>('/session/login', dataLogin);

		Cookies.set('auth-token', data.access_token, { expires: 2 });
		Cookies.set(
			'user',
			JSON.stringify({ id: data.id, name: data.name, email: data.email }),
			{ expires: 2 }
		);

		return data;
	} catch (error) {
		if (error instanceof AxiosError && error.response && (error.response.status >= 400 && error.response.status < 500)) {
			throw new Error('Credenciais inválidas');
		}

		throw new Error('Erro desconhecido');
	}
}
