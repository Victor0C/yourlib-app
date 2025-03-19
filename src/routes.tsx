import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import ProtectedRoutes from './utils/Protectedroutes';

export const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/login' element={<Login />} />
				
				<Route element={<ProtectedRoutes />}>
					<Route path='/home' element={<p>Teste da home</p>} />
					<Route path='*' element={<Navigate to='/home' />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};
