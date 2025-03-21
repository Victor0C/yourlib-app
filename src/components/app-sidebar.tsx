import { BookPlus, BookType, BookUp2, BookUser, Home, ListOrdered, SquareLibrary, User } from 'lucide-react';

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
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const user = JSON.parse(Cookies.get('user') ?? 'Usuário');

const items = [
	{
		title: user.name,
		url: '/user',
		icon: User,
	},
	{
		title: 'Livros',
		url: '/books',
		icon: SquareLibrary,
	},
	{
		title: 'Cadastrar livro',
		url: '/books/register',
		icon: BookPlus,
	},
	{
		title: 'Livros emprestados',
		url: '/books/loans',
		icon: BookUser,
	},
	{
		title: 'Gêneros de livros',
		url: '/books/genres',
		icon: BookType,
	},
	{
		title: 'Listas de espera',
		url: '/books/waitlists',
		icon: ListOrdered,
	},
];

export function AppSidebar() {
	const navigate = useNavigate();
	const isMobile = useIsMobile();

	return (
		<Sidebar className='!border-none' collapsible='icon'>
			<SidebarContent className='bg-[#1F2328] text-[#BD8D4C]'>
				<SidebarGroup>
					<SidebarGroupLabel
						className={`text-5xl spectral-sc-semibold pt-4 text-[#cdc4c4] group-data-[state="expanded"]:mb-4 ${
							isMobile ? 'mb-5' : ''
						}`}>
						YourLib
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
