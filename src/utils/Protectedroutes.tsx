import Cookies from 'js-cookie';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
	const token = Cookies.get('auth-token');
	const user = Cookies.get('user');
	return token && user ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoutes;
