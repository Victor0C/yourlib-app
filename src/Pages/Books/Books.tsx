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
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';

const Books = () => {
	return (
		<Card className='w-full h-auto card bg-[#1F2328] border-[#BD8D4C] border-2 py-2 px-2 '>
			<div className='flex w-full items-center space-x-2'>
				<Input
					className='text-[#d8d6d2] bg-[#282C34] border-[#BD8D4C]
												focus:border-[#BD8D4C] focus:ring-[#BD8D4C]'
					type='text'
					placeholder='Pesquise um livro'
				/>
				<Button
					type='submit'
					className='bg-[#BD8D4C] text-[#1F2328] hover:bg-[#A77B3B] 
                font-bold transition-colors disabled:opacity-50'>
					<Search />
				</Button>
				<Button
					type='submit'
					className='bg-[#BD8D4C] text-[#1F2328] hover:bg-[#A77B3B] 
                font-bold transition-colors disabled:opacity-50'>
					<Plus />
				</Button>
			</div>
			<Table>
				<TableCaption className='text-[#f1e2e2] text-sm'>
					Você tem 10 livros cadastrados
				</TableCaption>
				<TableHeader>
					<TableRow className='hover:bg-transparent'>
						<TableHead className='text-[#f1e2e2] w-9/12'>Título</TableHead>
						<TableHead className='text-[#f1e2e2] text-center'>Status</TableHead>
						<TableHead className='text-[#f1e2e2] text-center'>
							Condição
						</TableHead>
						<TableHead className='text-[#f1e2e2] text-center'>Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className='text-[#f1e2e2]'>
					<TableRow className='hover:bg-transparent'>
						<TableCell className='font-medium w-9/12'>
							Snehor dos Aneis
						</TableCell>
						<TableCell className='text-center'>Disponivel</TableCell>
						<TableCell className='text-center'>Bom</TableCell>
						<TableCell className='text-center'>
							<div className='flex justify-center items-center space-x-3'>
								<Eye size={20} />
								<Pencil size={17} />
								<Trash2 size={18} />
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default Books;
