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
import { zodResolver } from '@hookform/resolvers/zod';
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

import { Author, createAuthor, updateAuthor } from '@/services/Auhors';
import { Textarea } from '../ui/textarea';

interface CreateEditAuthorProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	refresh: () => void;
	author: Author | null;
}

const CreateEditAuthor = (props: CreateEditAuthorProps) => {
	const toastPromise = useMyToastPromise();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		form.reset(getDefaultValues());
	}, [props.author]);

	const FormSchema = z.object({
		name: z.string({
			message: 'Insira o nome do autor',
		}),
		bio: z.string({
			message: 'Informe a bio do autor',
		}),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: getDefaultValues(),
	});

	function getDefaultValues() {
		if (props.author) {
			return {
				_id: props.author._id,
				name: props.author.name,
				bio: props.author.bio,
			};
		}
		return {
			name: '',
			bio: '',
		};
	}

	function onSubmit(data: z.infer<typeof FormSchema>) {
		setIsLoading(true);
		toastPromise(
			props.author
				? updateAuthor(props.author._id, data as Omit<Author, '_id' | 'userId'>)
				: createAuthor(data),
			() => {
				setTimeout(() => props.refresh(), 1000);

				if (!props.author) {
					close();
				}

				setIsLoading(false);
				return `Autor ${
					props.author ? 'atualizado' : 'cadastrado'
				} com sucesso`;
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

	function close() {
		form.reset(getDefaultValues());
		props.onOpenChange(false);
	}

	return (
		<Sheet open={props.open}>
			<SheetContent
				className='bg-[#1F2328] border-none'
				withoutCloseButton={true}>
				<SheetHeader>
					<SheetTitle className='text-[#BD8D4C]'>
						{props.author ? props.author.name : 'Cadastrar gênero'}
					</SheetTitle>
					<SheetDescription className='text-[#BD8D4C]'>
						Mestre, o formulário abaixo contém os detalhes deste autor. Você
						pode atualizá-lo se quiser.
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						style={{ display: 'contents' }}>
						<div className='grid gap-4 py-4 px-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-[#BD8D4C]'>Nome</FormLabel>
										<FormControl>
											<Input
												type='string'
												className='text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C]'
												placeholder='Informe o nome do autor'
												{...field}
											/>
										</FormControl>
										<FormMessage className='text-red-400' />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='bio'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-[#BD8D4C]'>Bio</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Escreva a bio do autor'
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
								className='bg-[#BD8D4C] text-[#1F2328] hover:bg-[#9E744A]'
								disabled={isLoading}>
								Salvar
							</Button>
							<Button
								type='button'
								onClick={() => close()}
								className='bg-red-600 text-[#1F2328] hover:bg-red-700'
								disabled={isLoading}>
								Cancelar
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
};

export default CreateEditAuthor;
