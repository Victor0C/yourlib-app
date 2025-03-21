import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import ProtectedRoutes from './utils/Protectedroutes';
import Layout from './Layout/Layout';

export const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/login' element={<Login />} />

				<Route element={<ProtectedRoutes />}>
					<Route element={<Layout />}>
						<Route path='/home' element={<p>Teste da home</p>} />
						<Route path='/books' element={<p>Teste do books</p>} />
						<Route path='/books/register' element={<p>Teste do register</p>} />
						<Route path='/books/loans' element={<p>Teste do loans</p>} />
						<Route path='*' element={<Navigate to='/home' />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};
