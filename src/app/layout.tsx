import './globals.css';

import { ModalProvider } from '@/components/context/ModalContext';
import { SnackBarProvider } from '@/components/context/SnackBarContext';
import NavigationBar from '@/components/layouts/Navbar';

import { NextAuthProvider } from '../providers/NextAuthProvider';

export const metadata = {
	title: "Surf Tracker",
	description: "Track your surf sessions and improve your skills",
};

export default function RootLayout({
	children,
	session,
}: {
	children: React.ReactNode;
	session: any;
}) {
	return (
		<html lang="en">
			<body>
				<NextAuthProvider>
					<ModalProvider>
						<SnackBarProvider>
							<NavigationBar title="Title" />
							<div className="p-8">{children}</div>
						</SnackBarProvider>
					</ModalProvider>
				</NextAuthProvider>
			</body>
		</html>
	);
}
