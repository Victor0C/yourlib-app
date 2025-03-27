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
import { Book, createBook } from '@/services/Books';
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
	FormMessage,
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
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';

interface CreateEditBookProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	refresh: () => void;
	book: Book | null;
}

const CreateEditBook = (props: CreateEditBookProps) => {
	const toastPromise = useMyToastPromise();
	const [authors, setAuthors] = useState<Author[]>([]);
	const [genres, setGenres] = useState<Genre[]>([]);

	useEffect(() => {
		if (props.open && authors.length == 0 && genres.length == 0) {
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
		title: z.string({
			message: 'Insira o título do livro',
		}),
		authors: z.array(z.string()).min(1, 'Selecione pelo menos um autor'),
		genres: z.array(z.string()).min(1, 'Selecione pelo menos um gênero'),
		condition: z.string({
			message: 'Selecione o estado do livro',
		}),
		pages: z.coerce
			.number({
				message: 'Informe quantas páginas tem o livro',
				invalid_type_error: 'Deve ser um número válido',
			})
			.min(1, 'O livro deve ter pelo menos 1 página')
			.positive('O número de páginas deve ser positivo'),
		description: z.string({
			message: 'Informe a descrição do livro',
		}),
		status: z.string({
			message: 'Selecione o status do livro',
		}),
	});

	const conditions = [
		{ label: 'Novo', value: 'NEW' },
		{ label: 'Bom', value: 'GOOD' },
		{ label: 'Desgastado', value: 'WORN' },
	];
	const listStatus = [
		{ label: 'Disponível', value: 'AVAILABLE' },
		{ label: 'Emprestado', value: 'BORROWED' },
	];

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		toastPromise(
			createBook(data),
			() => {
				props.onOpenChange(false);
				setTimeout(() => props.refresh(), 1000);
				return 'Livro cadastrado com sucesso';
			},
			(error) => {
				if (error instanceof Error) {
					return error.message;
				}
				return 'Erro desconhecido';
			}
		);
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
								name='title'
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
								name='authors'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-[#BD8D4C]'>Autores</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant='outline'
														role='combobox'
														className={cn(
															'w-full justify-between text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C] truncate px-4',
															!field.value?.length &&
																'text-[#838586] opacity-70'
														)}>
														<span className='truncate pr-0.5'>
															{field.value?.length
																? field.value
																		.map(
																			(id) =>
																				authors.find(
																					(author) => author._id === id
																				)?.name
																		)
																		.join(', ')
																: 'Selecione os autores'}
														</span>
														<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className='w-85 p-0 bg-[#1F2328] border-[#BD8D4C]'>
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
																		const currentValues = field.value || [];
																		const newValues = currentValues.includes(
																			author._id
																		)
																			? currentValues.filter(
																					(id) => id !== author._id
																			  )
																			: [...currentValues, author._id];
																		form.setValue('authors', newValues);
																	}}>
																	<div className='flex items-center'>
																		<Checkbox
																			checked={field.value?.includes(
																				author._id
																			)}
																			className='mr-2 data-[state=checked]:text-[#BD8D4C] data-[state=checked]:border-[#BD8D4C] data-[state=checked]:bg-[#F5F5F5]'
																		/>
																		{author.name}
																	</div>
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
								name='genres'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-[#BD8D4C]'>Gêneros</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant='outline'
														role='combobox'
														className={cn(
															'w-full justify-between text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C] truncate px-4',
															!field.value?.length &&
																'text-[#838586] opacity-70'
														)}>
														<span className='truncate pr-0.5'>
															{field.value?.length
																? field.value
																		.map(
																			(id) =>
																				genres.find((genre) => genre._id === id)
																					?.name
																		)
																		.join(', ')
																: 'Selecione os gêneros'}
														</span>
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
																	value={genre.name}
																	key={genre._id}
																	className='text-[#BD8D4C] hover:bg-[#2D3339]'
																	onSelect={() => {
																		const currentValues = field.value || [];
																		const newValues = currentValues.includes(
																			genre._id
																		)
																			? currentValues.filter(
																					(id) => id !== genre._id
																			  )
																			: [...currentValues, genre._id];
																		form.setValue('genres', newValues);
																	}}>
																	<div className='flex items-center'>
																		<Checkbox
																			checked={field.value?.includes(genre._id)}
																			className='mr-2 data-[state=checked]:text-[#BD8D4C] data-[state=checked]:border-[#BD8D4C] data-[state=checked]:bg-[#F5F5F5]'
																		/>
																		{genre.name}
																	</div>
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
								name='status'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-[#BD8D4C]'>Status</FormLabel>
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
															? listStatus.find(
																	(status) => status.value === field.value
															  )?.label
															: 'Selecione o status'}
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
															Nenhum status encontrado.
														</CommandEmpty>
														<CommandGroup>
															{listStatus.map((status) => (
																<CommandItem
																	value={status.value}
																	key={status.value}
																	className='text-[#BD8D4C] hover:bg-[#2D3339]'
																	onSelect={() => {
																		form.setValue('status', status.value);
																	}}>
																	{status.label}
																	<Check
																		className={cn(
																			'ml-auto text-[#BD8D4C]',
																			status.value === field.value
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
												onChange={(e) => {
													// Converte para número antes de atualizar o campo
													const value =
														e.target.value === ''
															? undefined
															: Number(e.target.value);
													field.onChange(value);
												}}
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
