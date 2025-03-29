import CreateEditBook from '@/components/Books/CreateEditBook';
import { useMyToastPromise } from '@/components/MyToasts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Book,
	conditionBookMap,
	getBooks,
	statusBookMap,
} from '@/services/Books';
import { Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const Books = () => {
	const [books, setBooks] = useState<Book[]>([]);
	const [requestBooks, setRequestBooks] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [search, setSearch] = useState<string>('');
	const [openCreateUpdate, setOpenCreateUpdate] = useState<boolean>(false);

	const toastPromise = useMyToastPromise();
	const [targetBook, setTargetBook] = useState<Book | null>(null);

	function refresh() {
		setRequestBooks(!requestBooks);
	}

	useEffect(() => {
		setIsLoading(true);
		toastPromise(
			getBooks(),
			(data) => {
				setBooks(data);
				setIsLoading(false);
				return 'Registros coletados';
			},
			(error) => {
				setIsLoading(false);
				if (error instanceof Error) {
					return error.message;
				}
				return 'Erro desconhecido';
			}
		);
	}, [requestBooks, search]);

	const createUpdate = (book: Book | null = null) => {
		setTargetBook(book);
		setOpenCreateUpdate(true);
	};

	return (
		<Card className='w-full h-auto card bg-[#1F2328] border-[#BD8D4C] border-2 py-2 px-2 '>
			<CreateEditBook
				open={openCreateUpdate}
				onOpenChange={setOpenCreateUpdate}
				refresh={refresh}
				book={targetBook}
			/>
			<div className='flex w-full items-center space-x-2'>
				<form
					className='flex w-full items-center'
					onSubmit={(e) => {
						e.preventDefault();
						setSearch(e.currentTarget.search.value);
					}}>
					<Input
						name='search'
						className='text-[#d8d6d2] bg-[#282C34] border-[#BD8D4C]
        focus:border-[#BD8D4C] focus:ring-[#BD8D4C]'
						type='text'
						placeholder='Pesquise um livro'
						disabled={isLoading}
					/>
					<Button
						type='submit'
						className='bg-[#BD8D4C] text-[#1F2328] hover:bg-[#A77B3B] 
      font-bold transition-colors disabled:opacity-50 ml-2'
						disabled={isLoading}>
						<Search />
					</Button>
				</form>
				<Button
					type='button'
					className='bg-[#BD8D4C] text-[#1F2328] hover:bg-[#A77B3B] 
      font-bold transition-colors disabled:opacity-50'
					disabled={isLoading}
					onClick={() => createUpdate()}>
					<Plus />
				</Button>
			</div>
			{books.length === 0 ? (
				<p className='text-[#f1e2e2] text-center my-4'>
					Nenhum livro encontrado
				</p>
			) : (
				<Table>
					<TableCaption className='text-[#f1e2e2] text-sm'>
						Você tem 10 livros cadastrados
					</TableCaption>
					<TableHeader>
						<TableRow className='hover:bg-transparent'>
							<TableHead className='text-[#f1e2e2] w-9/12'>Título</TableHead>
							<TableHead className='text-[#f1e2e2] text-center'>
								Status
							</TableHead>
							<TableHead className='text-[#f1e2e2] text-center'>
								Condição
							</TableHead>
							<TableHead className='text-[#f1e2e2] text-center'>
								Ações
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className='text-[#f1e2e2]'>
						{books.map((book: Book) => (
							<TableRow key={book._id} className='hover:bg-transparent'>
								<TableCell className='font-medium w-9/12'>
									{book.title}
								</TableCell>
								<TableCell className='text-center'>
									{statusBookMap[book.status as keyof typeof statusBookMap] ??
										book.status}
								</TableCell>
								<TableCell className='text-center'>
									{conditionBookMap[
										book.condition as keyof typeof conditionBookMap
									] ?? book.status}
								</TableCell>
								<TableCell className='text-center'>
									<div className='flex justify-center items-center space-x-3'>
										<Eye
											size={20}
											className={`${
												isLoading
													? 'opacity-50'
													: 'cursor-pointer hover:text-[#BD8D4C] transition-colors'
											}`}
											onClick={() => createUpdate(book)}
										/>
										<Trash2
											size={18}
											className={`${
												isLoading
													? 'opacity-50'
													: 'cursor-pointer hover:text-[#BD8D4C] transition-colors'
											}`}
										/>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</Card>
	);
};

export default Books;
