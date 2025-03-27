import { AxiosError } from 'axios';
import api from './axios';

interface Genre {
	_id: string;
	name: string;
	description: string;
	userId: string;
}

async function getAll(): Promise<Genre[]> {
	try {
		const { data } = await api.get<Genre[]>('/users/genres');
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
export type { Genre };
