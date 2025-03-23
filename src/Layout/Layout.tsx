import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Outlet } from 'react-router-dom';
import './Layout.css'

export default function Layout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className='layout w-screen'>
				<SidebarTrigger className='text-[#BD8D4C] text-2xl hover:bg-[#1F2328] hover:text-[#BD8D4C]' />
				<div className='mx-3'>
					<Outlet />
				</div>
			</main>
		</SidebarProvider>
	);
}
