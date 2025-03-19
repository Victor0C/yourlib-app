import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './App.css';
import { AppRoutes } from './routes';

function App() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: 0,
			},
		},
	});

	return (
		<QueryClientProvider client={queryClient}>
			<Toaster />
			<AppRoutes />
		</QueryClientProvider>
	);
}

export default App;
