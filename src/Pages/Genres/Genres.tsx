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
import { Genre, getAll as getGenres } from '@/services/Genres';
import { Eye, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const Genres = () => {
	const [genres, setGenres] = useState<Genre[]>([]);
	const [requestGenres] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [search, setSearch] = useState<string>('');
	// const [openCreateUpdate, setOpenCreateUpdate] = useState<boolean>(false);
	// const [targetGenre, setTargetGenre] = useState<Genre | null>(null);

	const toastPromise = useMyToastPromise();

	// function refresh() {
	//   setRequestGenres(!requestGenres);
	// }

	useEffect(() => {
		setIsLoading(true);
		toastPromise(
			getGenres(search),
			(data) => {
				setGenres(data);
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
	}, [requestGenres, search]);

	// const createUpdate = (book: Book | null = null) => {
	//   setTargetGenre(book);
	//   setOpenCreateUpdate(true);
	// };

	return (
		<Card className='w-full h-auto card bg-[#1F2328] border-[#BD8D4C] border-2 py-2 px-2 '>
			{/* <CreateEditBook
        open={openCreateUpdate}
        onOpenChange={setOpenCreateUpdate}
        refresh={refresh}
        book={targetGenre}
      /> */}
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
					// onClick={() => createUpdate()}
				>
					<Plus />
				</Button>
			</div>
			{genres.length === 0 ? (
				<p className='text-[#f1e2e2] text-center my-4'>
					Nenhum gênero encontrado
				</p>
			) : (
				<Table>
					<TableCaption className='text-[#f1e2e2] text-sm'>
						Você tem {genres.length} gêneros cadastrados
					</TableCaption>
					<TableHeader>
						<TableRow className='hover:bg-transparent'>
							<TableHead className='text-[#f1e2e2]'>Nome</TableHead>
							<TableHead className='text-[#f1e2e2] w-9/12'>Descrição</TableHead>
							<TableHead className='text-[#f1e2e2] text-center'>
								Ações
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className='text-[#f1e2e2]'>
						{genres.map((genre: Genre) => (
							<TableRow key={genre._id} className='hover:bg-transparent'>
								<TableCell className='font-medium'>{genre.name}</TableCell>
								<TableCell className='font-medium w-9/12'>
									{genre.description}
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
											// onClick={() => createUpdate(genre)}
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

export default Genres;
