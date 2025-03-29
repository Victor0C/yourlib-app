import { AxiosError } from 'axios';
import api from './axios';

interface Genre {
	_id: string;
	name: string;
	description: string;
	userId: string;
}

async function getAll(name:string = ''): Promise<Genre[]> {
	try {
		const { data } = await api.get<Genre[]>(`/users/genres?name=${name}`);
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

async function createGenre(genre: Omit<Genre, '_id' | 'userId'>) {
	try {
		const { data } = await api.post<Genre>('/users/genres', genre);
		return data;
	} catch (error) {
		if (
			error instanceof AxiosError &&
			error.response &&
			error.response.status >= 400 &&
			error.response.status < 500
		) {
			throw new Error('Erro ao cadastrar o gênero');
		}

		throw new Error('Erro desconhecido');
	}
}
async function updateGenre(id: string, genre: Omit<Genre, '_id' | 'userId'>) {
	try {
		const { data } = await api.patch<Genre>(`/users/genres/${id}`, genre);
		return data;
	} catch (error) {
		if (
			error instanceof AxiosError &&
			error.response &&
			error.response.status >= 400 &&
			error.response.status < 500
		) {
			throw new Error('Erro ao atualizar o livro');
		}

		throw new Error('Erro desconhecido');
	}
}

export { getAll, createGenre, updateGenre };
export type { Genre };
