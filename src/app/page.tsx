"use client";
import { useRouter } from 'next/navigation';

export default function Home() {
	const router = useRouter();
	// redirect to surf activity page
	router.push("/surf-session");
	return (
		<div>
			<h1>Surf Session</h1>
		</div>
	);
}
