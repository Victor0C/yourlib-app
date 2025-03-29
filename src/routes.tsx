import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import ProtectedRoutes from './utils/Protectedroutes';
import Layout from './Layout/Layout';
import Books from './Pages/Books/Books';

export const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/login' element={<Login />} />

				<Route element={<ProtectedRoutes />}>
					<Route element={<Layout />}>
						<Route
							path='/user'
							element={<p className='text-white'>Tela do usuário</p>}
						/>
						<Route
							path='/books'
							element={<Books/>}
						/>
						<Route
							path='/books/loans'
							element={<p className='text-white'>Tela dos emprestimos</p>}
						/>
						<Route
							path='/books/Waitlists'
							element={<p className='text-white'>Tela de espera</p>}
						/>
						<Route
							path='/books/genres'
							element={<p className='text-white'>Tela de generos dos livros</p>}
						/>

						<Route
							path='/books/authors'
							element={<p className='text-white'>Tela de generos dos autores</p>}
						/>

						<Route path='*' element={<Navigate to='/books' />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};
