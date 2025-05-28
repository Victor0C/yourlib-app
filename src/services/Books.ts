import { AxiosError } from 'axios';
import api from './axios';

interface Book {
	_id: string,
	title: string;
	authors: string[];
	pages: number;
	genres: string[];
	status: string;
	condition: string;
	description: string;
}


const statusBookMap = {
	AVAILABLE: 'DISPONÍVEL',
	BORROWED: 'EMPRESTADO',
};

const conditionBookMap = {
	NEW: 'NOVO',
	GOOD: 'EMPRESTADO',
	WORN: 'DESGASTADO',
};



async function getBooks(title: string = '') {
	try {
		const { data } = await api.get<Book[]>(`/users/books?title=${title}`);
		return data;
	} catch (error) {
		if (
			error instanceof AxiosError &&
			error.response &&
			error.response.status >= 400 &&
			error.response.status < 500
		) {
			throw new Error('Erro ao cadastrar o livro');
		}

		throw new Error('Erro desconhecido');
	}
}

async function getBookById(id: string) {
  try {
    const { data } = await api.get<Book>(`/users/books/${id}`);
    return data.title;
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500
    ) {
      throw new Error('Erro ao cadastrar o livro');
    }

    throw new Error('Erro desconhecido');  
  }
}

async function createBook(book: Omit<Book, '_id'>) {
	try {
		const { data } = await api.post<Book>('/users/books', book);
		return data;
	} catch (error) {
		if (
			error instanceof AxiosError &&
			error.response &&
			error.response.status >= 400 &&
			error.response.status < 500
		) {
			throw new Error('Erro ao cadastrar o livro');
		}

		throw new Error('Erro desconhecido');
	}
}
async function updateBook(id: string, book: Omit<Book, '_id'>) {
	try {
		const { data } = await api.patch<Book>(`/users/books/${id}`, book);
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

export {
	createBook,
	getBooks as getGenres,
	updateBook,
  getBookById,
	statusBookMap,
	conditionBookMap,
};
export type { Book };
