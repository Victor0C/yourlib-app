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
				navigate('/home');
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
					<Card className='w-96 h-auto card'>
						<CardHeader>
							<CardTitle>Olá, Mestre!</CardTitle>
							<CardDescription>
								Informe suas credenciais para acessar sua biblioteca
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-2'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type='email' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Senha</FormLabel>
										<FormControl>
											<Input type='password' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter className='card-footer'>
							<Button type='submit' className='w-full' disabled={disableButton}>
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
