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
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';

interface CreateEditBookProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const CreateEditBook = (props: CreateEditBookProps) => {
	useEffect(() => {
		if (props.open) {
			console.log('jhsfjkhsdf');
		}
	}, [props.open]);

	const FormSchema = z.object({
		titulo: z.string({
			message: 'Insira o título do livro',
		}),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(data);
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
					<SheetTitle className='text-[#BD8D4C]'>Edit profile</SheetTitle>
					<SheetDescription className='text-[#BD8D4C]'>
						Make changes to your profile here. Click save when you're done.
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
												{...field}
											/>
										</FormControl>
										<FormMessage className='text-red-400' />
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
