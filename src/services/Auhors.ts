import { AxiosError } from 'axios';
import api from './axios';

interface Author {
	_id: string;
	name: string;
	bio: string;
	userId: string;
}

async function getAll(name: string = ''): Promise<Author[]> {
	try {
		const { data } = await api.get<Author[]>(`/users/authors?name=${name}`);
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
	}

	throw new Error('Erro desconhecido');
}
async function createAuthor(author: Omit<Author, '_id' | 'userId'>) {
	try {
		const { data } = await api.post<Author>('/users/authors', author);
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

async function updateAuthor(id: string, author: Omit<Author, '_id' | 'userId'>) {
	try {
		const { data } = await api.patch<Author>(`/users/authors/${id}`, author);
		return data;
	} catch (error) {
		if (
			error instanceof AxiosError &&
			error.response &&
			error.response.status >= 400 &&
			error.response.status < 500
		) {
			throw new Error('Erro ao atualizar o autor');
		}

		throw new Error('Erro desconhecido');
	}
}

async function deleteAuthor(id: string): Promise<void> {
	try {
		await api.delete(`/users/authors/${id}`);
	} catch (error) {
		if (
			error instanceof AxiosError &&
			error.response &&
			error.response.status >= 400 &&
			error.response.status < 500
		) {
			throw new Error('Erro ao deletar o autor');
		}

		throw new Error('Erro desconhecido');
	}
}

export { getAll, createAuthor, updateAuthor, deleteAuthor };
export type { Author };
