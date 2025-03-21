import './Login.css';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import login from '@/services/login';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';

const Login = () => {

	const [disableButton, setDisableButton] = useState(false);

	const FormSchema = z.object({
		email: z.string().email({
			message: 'Insira um email válido',
		}),
		password: z.string().min(6, {
			message: 'A senha deve ter no mínimo 6 caracteres',
		}),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const navigate = useNavigate();

	async function onSubmit(data: z.infer<typeof FormSchema>): Promise<void> {
		setDisableButton(true);

		toast.promise(login(data), {
			loading: 'Carregando...',
			success: (data) => {
				navigate('/books');
				return `Bem-vindo, mestre ${data.name}!`;
			},
			error: (error) => {
				setDisableButton(false);

				if (error instanceof Error) {
					return error.message;
				}

				return 'Erro desconhecido';
			},
			position: 'top-right',
		});
	}

	return (
		<section className='section w-screen h-screen flex justify-center items-center'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<Card className='w-96 h-auto card bg-[#1F2328] border-[#BD8D4C] border-2'>
						<CardHeader className='space-y-2'>
							<CardTitle className='text-[#BD8D4C] text-2xl font-bold text-center'>
								Olá, Mestre!
							</CardTitle>
							<CardDescription className='text-[#BD8D4C] text-center'>
								Informe suas credenciais para acessar sua biblioteca
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-[#BD8D4C] font-medium'>
											Email
										</FormLabel>
										<FormControl>
											<Input
												className='text-[#d8d6d2] bg-[#282C34] border-[#BD8D4C]
												focus:border-[#BD8D4C] focus:ring-[#BD8D4C]'
												type='email'
												{...field}
											/>
										</FormControl>
										<FormMessage className='text-red-400' />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-[#BD8D4C] font-medium'>
											Senha
										</FormLabel>
										<FormControl>
											<Input
												className='text-[#d8d6d2] bg-[#282C34] border-[#BD8D4C]
												focus:border-[#BD8D4C] focus:ring-[#BD8D4C]'
												type='password'
												{...field}
											/>
										</FormControl>
										<FormMessage className='text-red-400' />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter className='card-footer'>
							<Button 
								type='submit' 
								className='w-full bg-[#BD8D4C] text-[#1F2328] hover:bg-[#A77B3B] 
								font-bold transition-colors disabled:opacity-50'
								disabled={disableButton}
							>
								Entrar
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</section>
	);
};

export default Login;
