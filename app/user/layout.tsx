import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import MainNav from "./main-nav";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   	<>
		<div className="flex flex-col">
			<div className="border-b container mx-auto">
				<div className="flex items-center h-16 p-4">
					<Link href="/" className="w-22">
						<Image
							src="/images/logo.svg"
							width={40}
							height={40}
							alt={`${APP_NAME} logo`}
							priority={true}
						/>
					</Link>
					<MainNav className='mx-6'/>
					<div className="ml-auto items-center flex space-x-4">
						<Menu/>
					</div>
					<Menu />
				</div>
			</div>
		</div>
		<div className="flex-1 space-y-4 pt-6 p-8 mx-auto container">
			{children}
		</div>
	</>
  );
}
