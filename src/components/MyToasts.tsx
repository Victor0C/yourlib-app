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
		errorCallback: (data: unknown) => string
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


const confirmActionMyToast = (
	text: string = 'Tem certeza em fazer isso?',
	confirmCallback: () => void
) => {
	toast(text, {
		action: {
			label: 'Sim',
			onClick: () => confirmCallback(),
		},
		style: defaultStyle,
		actionButtonStyle: {
			backgroundColor: '#BD8D4C',
			color: '#1F2328',
			border: '1px solid #BD8D4C',
			fontWeight: 'bold',
			borderRadius: '4px',
			padding: '4px 12px',
			marginLeft: '8px',
		},
	});
};

export { useMyToastPromise, confirmActionMyToast };
