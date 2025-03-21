import {  BookUp2, BookUser, Home, SquareLibrary } from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';

const items = [
	{
		title: 'Home',
		url: '/home',
		icon: Home,
	},
	{
		title: 'Livros',
		url: '/books',
		icon: SquareLibrary,
	},
	{
		title: 'Cadastrar livro',
		url: '/books/register',
		icon: BookUp2,
	},
	{
		title: 'Livros emprestados',
		url: '/books/loans',
		icon: BookUser,
	},
];

export function AppSidebar() {
	const navigate = useNavigate();

	return (
		<Sidebar className='!border-none'>
			<SidebarContent className='bg-[#1F2328] text-[#BD8D4C]'>
				<SidebarGroup>
					<SidebarGroupLabel className='text-5xl text-[#cdc4c4] mb-8 pt-2 spectral-sc-semibold'>
						YuorLib
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										isActive={window.location.pathname == item.url}
										className='text-lg data-[active=true]:bg-[#BD8D4C] data-[active=true]:text-white hover:bg-[#cdc4c4] hover:text-black'
										asChild>
										<p
											onClick={() =>
												window.location.pathname != item.url &&
												navigate(item.url)
											}
											className='cursor-pointer data-[active=true]:cursor-default'>
											<item.icon />
											<span>{item.title}</span>
										</p>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
