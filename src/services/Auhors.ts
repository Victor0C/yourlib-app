import { AxiosError } from 'axios';
import api from './axios';

interface Author {
	_id: string;
	name: string;
	bio: string;
	userId: string;
}

async function getAll(): Promise<Author[]> {
	try {
		const { data } = await api.get<Author[]>('/users/authors');
		return data;
	} catch (error) {
		if (
			error instanceof AxiosError &&
			error.response &&
			error.response.status >= 400 &&
			error.response.status < 500
		) {
			throw new Error('Erro ao recuperar os autores');
		}

		throw new Error('Erro desconhecido');
	}
}

export { getAll };
export type { Author };
