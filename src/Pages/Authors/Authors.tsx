import CreateEditAuthor from '@/components/Authors/CreateEditAuthor';
import { confirmActionMyToast, useMyToastPromise } from '@/components/MyToasts';
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
import { Author, deleteAuthor, getAll as getAuthors } from '@/services/Auhors';
import { Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const Authors = () => {
	const [authors, setAuthors] = useState<Author[]>([]);
	const [requestAuthors, setRequestAuthors] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [search, setSearch] = useState<string>('');
	const [openCreateUpdate, setOpenCreateUpdate] = useState<boolean>(false);
	const [targetAuthor, setTargetAuthor] = useState<Author | null>(null);

	const toastPromise = useMyToastPromise();

	function refresh() {
		setRequestAuthors(!requestAuthors);
	}

	useEffect(() => {
		setIsLoading(true);
		toastPromise(
			getAuthors(search),
			(data) => {
				setAuthors(data);
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
	}, [requestAuthors, search]);

	const createUpdate = (author: Author | null = null) => {
		setTargetAuthor(author);
		setOpenCreateUpdate(true);
	};

	const confirmDeleteAuthor = (author: Author) => {
		confirmActionMyToast(
			`Tem certeza em deletar o autor ${author.name}?`,
			() => {
				setIsLoading(true);
				toastPromise(
					deleteAuthor(author._id),
					() => {
						setIsLoading(false);
						refresh();
						return 'Autor deletado';
					},
					(error) => {
						setIsLoading(false);
						if (error instanceof Error) {
							return error.message;
						}
						return 'Erro desconhecido';
					}
				);
			}
		);
	};

	return (
		<Card className='w-full h-auto card bg-[#1F2328] border-[#BD8D4C] border-2 py-2 px-2 '>
			<CreateEditAuthor
				open={openCreateUpdate}
				onOpenChange={setOpenCreateUpdate}
				refresh={refresh}
				author={targetAuthor}
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
						placeholder='Pesquise um autor'
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
			{authors.length === 0 ? (
				<p className='text-[#f1e2e2] text-center my-4'>
					Nenhum autor encontrado
				</p>
			) : (
				<Table>
					<TableCaption className='text-[#f1e2e2] text-sm'>
						Você tem {authors.length} autores cadastrados
					</TableCaption>
					<TableHeader>
						<TableRow className='hover:bg-transparent'>
							<TableHead className='text-[#f1e2e2] w-11/12'>Nome</TableHead>
							<TableHead className='text-[#f1e2e2] text-center'>
								Ações
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className='text-[#f1e2e2]'>
						{authors.map((author: Author) => (
							<TableRow key={author._id} className='hover:bg-transparent'>
								<TableCell className='font-medium w-11/12'>
									{author.name}
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
											onClick={() => !isLoading && createUpdate(author)}
										/>
										<Trash2
											size={20}
											className={`${
												isLoading
													? 'opacity-50'
													: 'cursor-pointer hover:text-[#BD8D4C] transition-colors'
											}`}
											onClick={() => !isLoading && confirmDeleteAuthor(author)}
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

export default Authors;
