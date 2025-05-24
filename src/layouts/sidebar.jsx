import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/router";
import Image from "next/image";
import Link from "next/link";
import {useState, useEffect} from "react";

import {
	faMoneyBillAlt,
	faPaperPlane,
	faCalendarCheck as faCalendarCheckRegular,
	faClipboardList,
	faFolderOpen,
	faUsers as faUsersRegular,
	faQuestionCircle as faQuestionCircleRegular,
	faSignOutAlt,
	faListCheck as faListCheckRegular,
	faHome as faHomeSolid
} from '@awesome.me/kit-9b926a9ec0/icons/classic/regular';

import{useUser } from "@/components/UserContext"
import {dmsApi} from "@/../client";

const Sidebar = () => {
	const router = useRouter();
	const currentRoute = router.pathname;

	const menuSections = [
		{
			name: "Home",
			icon: faHomeSolid,
			path: "/",
		},
		{
			name: "To do",
			icon: faListCheckRegular,
			path: "/todo",
		},
		{
			name: "Salary",
			icon: faMoneyBillAlt,
			path: "/salary",
		},
		{
			name: "Leave",
			icon: faPaperPlane,
			path: "/leave",
		},
		{
			name: "Attendance",
			icon: faCalendarCheckRegular,
			path: "/attendance",
		},
		{
			name: "Expense Claims",
			icon: faClipboardList,
			path: "/expense-claims",
		},
		{
			name: "Document Center",
			icon: faFolderOpen,
			path: "/document-center",
		},
		{
			name: "People",
			icon: faUsersRegular,
			path: "/people",
		},
	];

	const { user } = useUser();

	const[getImage,setUserImage] =useState();
		
	useEffect(() => {
		const fetchProfileImage = async () => {
			if (user?.PhotoId) {
				try {
					const url = `/common/query/GetFile?fileid=${user.PhotoId}`;
					const response = await dmsApi.get(url, { responseType: 'blob' });
					const blob = response.data;
					const imageUrl = URL.createObjectURL(blob);
					setUserImage(imageUrl);
				} catch (error) {
					console.error("Failed to load profile image:", error);
				}
			}
		};

		fetchProfileImage();
	}, [user]);

	const scrollableHeight = "calc(100vh - 160px)";

	const sidebarScrollStyles = {
		overflowY: 'auto',
		maxHeight: scrollableHeight,
		scrollbarWidth: 'thin',
		scrollbarColor: '#4B5563 transparent',
	};

	const theme = {
		lightText: 'text-secondary-700 dark:text-secondary-200',
		lightActiveText: 'text-primary-800 dark:text-primary-50',
		lightBg: '',
		lightActiveBg: 'bg-primary-100 dark:bg-secondary-800/75',
		lightMenuText: 'text-primary-dark',
		activeHover: 'hover:bg-primary-100',
		hoverLightActiveBg: 'hover:bg-primary-100 hover:dark:bg-secondary-800/75 hover:text-primary-dark',
	}

	return (
		<aside className="sticky top-0 z-30 h-screen w-[260px] shrink-0 dark:border-secondary-700 bg-white dark:bg-secondary-900 dark:text-secondary-200">
			<div className="relative min-w-full overflow-hidden h-full shadow-sm flex flex-col">

				{/* Header */}
				<div className="px-4 py-9 flex items-center gap-3 border-secondary-200 dark:border-secondary-700 shrink-0">
					<div className="bg-primary-600 px-[10px] rounded py-1">
						<FontAwesomeIcon icon="fa-solid fa-chart-simple" className="text-white" />
					</div>
					<h1 className="text-2xl font-bold text-gray-700 dark:text-secondary-200">HRMS</h1>
				</div>

				{/* Scrollable Main Navigation */}
				<div className="overflow-y-auto flex-1 scrollbar-width-none"
					 style={sidebarScrollStyles}>
					<div>
						<ul className="space-y-1 mt-2">
							{menuSections.map((section) => (
								<li key={section.name}>
									<Link
										href={section.path}
									>
										<button
											className={`flex items-center w-full p-2.5 mb-2 text-sm font-medium ${theme.lightText}
												${currentRoute === section.path ? `${theme.lightActiveBg} ${theme.lightActiveText} border-r-[3px] border-primary-600` : `${theme.hoverLightActiveBg} dark:text-secondary-200`}`}
										>
											<div className="flex items-center gap-3">
												<FontAwesomeIcon
													icon={section.icon}
													className={`w-4 ${currentRoute === section.path ? theme.lightActiveText : `${theme.lightText}`}`}
												/>
												<span>{section.name}</span>
											</div>
										</button>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Links */}
				<div className=" border-gray-200 dark:border-secondary-700 p-3 mt-auto shrink-0">
					<ul className="space-y-1">
						<li>
							{/* Logout Link */}
							<button
								onClick={() => { sessionStorage.removeItem("user"); router.push("/login"); }}
								className={`flex items-center gap-3 rounded-md p-3 text-sm font-medium transition-colors ${theme.lightText} dark:text-secondary-200 hover:bg-gray-100 dark:hover:bg-secondary-800 w-full text-left`}
							>
								<FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
								<span>Logout</span>
							</button>
						</li>
					</ul>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;