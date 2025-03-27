import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Author, getAll as getAuthors } from '@/services/Auhors';
import { Book } from '@/services/Books';
import { Genre, getAll as getGenres } from '@/services/Genres';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMyToastPromise } from '../MyToasts';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../ui/form';

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

interface CreateEditBookProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	book: Book | null;
}

const CreateEditBook = (props: CreateEditBookProps) => {
	const toastPromise = useMyToastPromise();
	const [authors, setAuthors] = useState<Author[]>([]);
	const [genres, setGenres] = useState<Genre[]>([]);

	useEffect(() => {
		if (props.open && (authors.length == 0) && (genres.length == 0) ) {
			toastPromise(
				Promise.all([getAuthors(), getGenres()]),
				([authorsData, genresData]) => {
					setAuthors(authorsData);
					setGenres(genresData);
					return 'Registros coletados com sucesso';
				},
				(error) => {
					if (error instanceof Error) {
						return error.message;
					}
					return 'Erro desconhecido';
				}
			);
		}
	}, [props.open]);

	const FormSchema = z.object({
		titulo: z.string({
			message: 'Insira o título do livro',
		}),
		author: z.string({
			message: 'Selecione o autor do livro',
		}),
		genre: z.string({
			message: 'Selecione o autor do livro',
		}),
		condition: z.string({
			message: 'Selecione o estado do livro',
		}),
		pages: z.number({
			message: 'Informe quantas páginas tem o livro',
		}),
		description: z.string({
			message: 'Informe a descrição do livro',
		}),
	});

	const conditions = [
		{ label: 'Bom', value: 'good' },
		{ label: 'Perfeito', value: 'perfect' },
		{ label: 'Ruim', value: 'bad' }
	];

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		let dataToSubmit = {
			authors = [data.author]
		 }
	}

	function close() {
		form.reset();
		props.onOpenChange(false);
	}

	return (
		<Sheet open={props.open}>
			<SheetContent
				className='bg-[#1F2328] border-none'
				withoutCloseButton={true}>
				<SheetHeader>
					<SheetTitle className='text-[#BD8D4C]'>
						{props.book
							? `Editar o livro ${props.book.title}`
							: 'Cadastrar livro'}
					</SheetTitle>
					<SheetDescription className='text-[#BD8D4C]'>
						Mestre, por favor preencha o formulário abaixo para tratar desse
						registro
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						style={{ display: 'contents' }}>
						<div className='grid gap-4 py-4 px-4'>
							<FormField
								control={form.control}
								name='titulo'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-[#BD8D4C]'>Titulo</FormLabel>
										<FormControl>
											<Input
												type='string'
												className='text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C]'
												placeholder='Informe o título do livro'
												{...field}
											/>
										</FormControl>
										<FormMessage className='text-red-400' />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='author'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-[#BD8D4C]'>Autor</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant='outline'
														role='combobox'
														className={cn(
															'w-full justify-between text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C]',
															!field.value && 'text-[#838586] opacity-70'
														)}>
														{field.value
															? authors.find(
																	(author: Author) => author._id === field.value
															  )?.name
															: 'Selecione o autor'}
														<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className='w-85  p-0 bg-[#1F2328] border-[#BD8D4C] '>
												<Command className='bg-[#1F2328]'>
													<CommandInput
														placeholder='Procure o autor...'
														className='text-[#BD8D4C]'
													/>
													<CommandList>
														<CommandEmpty className='text-[#BD8D4C] text-center py-2'>
															Nenhum autor encontrado.
														</CommandEmpty>
														<CommandGroup>
															{authors.map((author: Author) => (
																<CommandItem
																	value={author.name}
																	key={author._id}
																	className='text-[#BD8D4C] hover:bg-[#2D3339]'
																	onSelect={() => {
																		form.setValue('author', author._id);
																	}}>
																	{author.name}
																	<Check
																		className={cn(
																			'ml-auto text-[#BD8D4C]',
																			author._id === field.value
																				? 'opacity-100'
																				: 'opacity-0'
																		)}
																	/>
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage className='text-red-400' />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='genre'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-[#BD8D4C]'>Gênero</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant='outline'
														role='combobox'
														className={cn(
															'w-full justify-between text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C]',
															!field.value && 'text-[#838586] opacity-70'
														)}>
														{field.value
															? genres.find(
																	(genre: Genre) => genre._id === field.value
															  )?.name
															: 'Selecione o gênero'}
														<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className='w-85 p-0 bg-[#1F2328] border-[#BD8D4C]'>
												<Command className='bg-[#1F2328]'>
													<CommandInput
														placeholder='Procure o gênero...'
														className='text-[#BD8D4C]'
													/>
													<CommandList>
														<CommandEmpty className='text-[#BD8D4C] text-center py-2'>
															Nenhum gênero encontrado.
														</CommandEmpty>
														<CommandGroup>
															{genres.map((genre: Genre) => (
																<CommandItem
																	value={genre._id}
																	key={genre._id}
																	className='text-[#BD8D4C] hover:bg-[#2D3339]'
																	onSelect={() => {
																		form.setValue('genre', genre._id);
																	}}>
																	{genre.name}
																	<Check
																		className={cn(
																			'ml-auto text-[#BD8D4C]',
																			genre._id === field.value
																				? 'opacity-100'
																				: 'opacity-0'
																		)}
																	/>
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage className='text-red-400' />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='condition'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-[#BD8D4C]'>Estado</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant='outline'
														role='combobox'
														className={cn(
															'w-full justify-between text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C]',
															!field.value && 'text-[#838586] opacity-70'
														)}>
														{field.value
															? conditions.find(
																	(condition) => condition.value === field.value
															  )?.label
															: 'Selecione o estado'}
														<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className='w-85 p-0 bg-[#1F2328] border-[#BD8D4C]'>
												<Command className='bg-[#1F2328]'>
													<CommandInput
														placeholder='Procure o gênero...'
														className='text-[#BD8D4C]'
													/>
													<CommandList>
														<CommandEmpty className='text-[#BD8D4C] text-center py-2'>
															Nenhum estado encontrado.
														</CommandEmpty>
														<CommandGroup>
															{conditions.map((condition) => (
																<CommandItem
																	value={condition.value}
																	key={condition.value}
																	className='text-[#BD8D4C] hover:bg-[#2D3339]'
																	onSelect={() => {
																		form.setValue('condition', condition.value);
																	}}>
																	{condition.label}
																	<Check
																		className={cn(
																			'ml-auto text-[#BD8D4C]',
																			condition.value === field.value
																				? 'opacity-100'
																				: 'opacity-0'
																		)}
																	/>
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage className='text-red-400' />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='pages'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-[#BD8D4C]'>
											Número de páginas
										</FormLabel>
										<FormControl>
											<Input
												type='number'
												min='1'
												className='text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
												placeholder='Informe o número de páginas do livro'
												{...field}
											/>
										</FormControl>
										<FormMessage className='text-red-400' />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-[#BD8D4C]'>Descrição</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Escreva a descrição do livro'
												className=' text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none resize-none'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<SheetFooter>
							<Button
								type='submit'
								className='bg-[#BD8D4C] text-[#1F2328] hover:bg-[#9E744A]'>
								Salvar
							</Button>
							<Button
								type='button'
								onClick={() => close()}
								className='bg-red-600 text-[#1F2328] hover:bg-red-700'>
								Cancelar
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
};

export default CreateEditBook;
