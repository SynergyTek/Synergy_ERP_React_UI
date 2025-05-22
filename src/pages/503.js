import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChainBroken} from "@awesome.me/kit-9b926a9ec0/icons/classic/regular";

import {Button, Icon} from "~";
import {useRouter} from "next/router";
import {useSidebar} from "@/layouts/SidebarContext";
import {useEffect} from "react";

export default function Custom503({sidebar = false}) {
	const { setSidebar } = useSidebar();

	useEffect(() => {
		setSidebar(false);
	}, [setSidebar]);

	const router = useRouter();
	return (
		<div className={"w-full h-dvh flex items-center justify-center"}>
			<main className="grid place-items-center p-12 rounded-md shadow bg-blue-50 dark:bg-gray-900">
				<div className="text-center">
					<p className="font-semibold text-2xl -translate-x-3">
						<Icon icon={"exclaimation"}/> 503
					</p>
					<h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
						Page under maintainance
					</h1>
					<p className="mt-6 text-base leading-7">
						We are still working on this page, please check back later.
					</p>
					<p className={"mt-6 mb-3 text-base text-start font-bold"}>
						What can you do?
					</p>
					
					<ul className="max-w-md space-y-1 text-gray-500 text-start list-disc list-inside dark:text-gray-400">
						<li>
							Check if the URL contains any spelling errors or invalid
							characters
						</li>
						<li>Make sure you have not clicked on a broken or expired link</li>
						<li>
							If you feel the URL is correct and this is a problem from our
							side, please{" "}
							<Link
								className={"underline hover:underline-offset-4"}
								href={"/contact"}
							>
								report this
							</Link>
						</li>
					</ul>
					
					<div className="mt-10 flex items-center justify-center gap-x-6">
						{/*<Button className={"secondary"}>*/}
						{/*  <Link href={"/"}>Go to home</Link>*/}
						{/*</Button>*/}
						<Button
							className={"primary"}
							onClick={() => {
								router.back();
							}}
							text="Go back"
						></Button>
					</div>
				</div>
			</main>
		</div>
	);
}
