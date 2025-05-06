import { AxiosError } from 'axios';
import api from './axios';
import { getBookById } from './Books';
import { ReactNode } from 'react';
import { getAllLoans } from './Loans';

interface Loan {
  bookName: ReactNode;
	_id: string,
	book: string;
	user: string;
	borrowerName: string;
	borrowerEmail: string;
	dueDate: string;
	status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
	bookConditionBefore: string;
  notes: string;
}

interface createLoan {
  book?: string;
  borrowerName: string;
  borrowerEmail: string;
  loanDate: string; 
  dueDate: string;
  bookConditionBefore: string;
  notes?: string;
}

interface LoanWithBookName extends Loan {
  bookName: string;
}

const statusLoan = {
	BORROWED: 'EMPRESTADO',
  RETURNED: 'DEVOLVIDO',
  OVERDUE: 'ATRASADO'
};

async function WaitList() {
  try {
    const { data } = await api.get<Loan[]>('/users/loans/active');
    return data;
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500
    ) {
      throw new Error('Erro ao recuperar os emprestimos');
    }

    throw new Error('Erro desconhecido');
  }
}

async function getAllLoansWithBookNames(): Promise<LoanWithBookName[]> {
  const loans = await getAllLoans();  
  const loansWithNames = await Promise.all(
    loans.map(async (loan) => {
      try {
        const bookName = await getBookById(loan.book);  
        return {
          ...loan,
          bookName
        };
      } catch (error) {
        return {
          ...loan,
          bookName: 'Nome não disponível'
        };
      }
    })
  );
  return loansWithNames;
}

async function updateLoan(id: string, updateLoan: any) {
  try {
    const { data } = await api.patch<Loan>(`/users/loans/${id}`,updateLoan);
    return data;
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500
    ) {
      throw new Error('Erro ao recuperar os emprestimos');
    }

    throw new Error('Erro desconhecido');
  }
}

async function createLoan(loan: createLoan) {
  try {
    console.log('loan', loan);
    const { data } = await api.post<createLoan>('/users/loans', loan);
    return data;
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500
    ) {
      throw new Error('Erro ao recuperar os emprestimos');
    }

    throw new Error('Erro desconhecido');
  }
}

export {
  getAllLoans,
  updateLoan,
  createLoan,
  getAllLoansWithBookNames, statusLoan
};
  export type { LoanWithBookName };
export type { WaitList };
