import { toast } from 'sonner';

interface ToastStyle {
	backgroundColor: string;
	color: string;
	border: string;
}

const defaultStyle: ToastStyle = {
	backgroundColor: '#1F2328',
	color: '#BD8D4C',
	border: '1px solid #BD8D4C',
};

const useMyToastPromise = () => {
	const errorStyle: ToastStyle = {
		backgroundColor: '#ff0000',
		color: '#000000',
		border: '1px solid #000000',
	};

	const showToastPromise = <T,>(
		promise: Promise<T>,
		successCallback: (data: T) => string,
		errorCallback: (data: T) => string
	) => {
		return toast.promise(promise, {
			loading: 'Carregando...',
			success: (data) => {
				return successCallback(data);
			},
			error: (error) => {
				return {
					style: errorStyle,
					message: errorCallback(error),
				};
			},
			position: 'top-right',
			style: defaultStyle,
		});
	};

	return showToastPromise;
};

export { useMyToastPromise };
