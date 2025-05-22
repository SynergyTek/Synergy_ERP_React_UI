
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/router";
import Image from "next/image";
import {far} from "@awesome.me/kit-9b926a9ec0/icons";
import Link from "next/link";
import {useState} from "react";

import {
	faBook,
	faFiles,
	faChevronDown,
	faChevronUp,
	faFileAlt,
	faGears,
	faHome,
	faListCheck,
	faQuestionCircle,
	faUpload,
	faUserTie,
	faWindowRestore,
	faAngleRight,
	faChartPie,
	faEnvelope,
	faServer,
	faMagnifyingGlassPlus,
	faFile,
	faBarsProgress,
	faSquareList,
	faChartMixed,
	faCopy,
	faUser,
	faUsers,
	faUserPlus, faSparkles, faCloudArrowUp
} from "@awesome.me/kit-9b926a9ec0/icons/classic/solid";
import {icon} from "@fortawesome/fontawesome-svg-core";



const Sidebar = () => {
	const router = useRouter();
	const currentRoute = router.pathname;
	const [expandedMenu, setExpandedMenu] = useState("Document Management");

	const toggleMenu = (name) => {
		setExpandedMenu((prev) => (prev === name ? null : name));
	};

	const handleLinkClick = (e, path) => {
		if (currentRoute === path) {
			e.preventDefault();
		}
	};

	const menuSections = [
	
		{
			name: "Dashboard",
			icon: 'fa-regular fa-home',
			path: "/",
		},
		
		{
			name: "Admin",
			icon: 'fa-regular fa-user-tie',
			items: [
				{name: "Admin Dashboard", path: "/admin/dashboard", icon: faChartMixed},			
				{name: "User", path: "/admin/user", icon: faUser},			
			]
		}
		
	];

	const scrollableHeight = "calc(100vh - 160px)";

	const sidebarScrollStyles = {
		overflowY: 'auto',
		maxHeight: scrollableHeight,
		scrollbarWidth: 'thin',
		scrollbarColor: '#4B5563 transparent',
	};

	const theme = {
		lightText: 'text-gray-100/90',
		lightActiveText: 'text-primary-50',
		lightBg: '',
		lightActiveBg: 'bg-primary-700',
		lightMenuText: 'text-primary-400',
		activeHover: 'hover:bg-transparent',
		hoverLightActiveBg: 'hover:bg-primary-700 hover:text-white',
	}


	return (
		<aside className="sticky top-0 z-30 h-screen w-[260px] shrink-0 bg-white dark:bg-secondary-900 dark:text-secondary-200">
			<div className="relative min-w-full overflow-hidden h-full bg-secondary-800 shadow-sm flex flex-col ">
				{/* <div className="absolute top-0 right-[-20px] h-full w-7
                bg-white dark:bg-secondary-900
                rounded-l-full z-40 shadow-md dark:shadow-secondary-800
                pointer-events-none">
</div> */}

				{/* Header */}
				<div className="h-20 px-4 flex items-center gap-3 border-gray-200 dark:border-secondary-700 shrink-0">
					<Image
						src="/images/dms_icon.jpeg"
						alt="Synergy Logo"
						width={40}
						height={40}
						className="pb-1.5 px-1 rounded-full bg-white"
					/> 
					<h1 className="text-2xl font-semibold text-gray-200 dark:text-secondary-200">Synergy</h1>
				</div>

				{/* Scrollable Main Navigation */}
				<div className="overflow-y-auto flex-1 scrollbar-width-none"
					 style={sidebarScrollStyles}>
					<div className="p-2">
						<ul className="space-y-1 mt-2">
							{menuSections.map((section) => {
								if (section.items) {
									const isActiveSection = section.items.some(item => currentRoute === item.path);

									return (
										<li key={section.name}>
											<button
												onClick={() => toggleMenu(section.name)}
												className={`flex items-center justify-between w-full p-2.5 mb-2 rounded-lg text-sm font-medium ${theme.lightText} 
												dark:text-secondary-200 ${theme.hoverLightActiveBg} ${isActiveSection && theme.activeHover} dark:hover:bg-secondary-800 transition-colors`}
											>
												<div className="flex items-center gap-3">
													<FontAwesomeIcon
														icon={section.icon}
														className={`w-4 ${isActiveSection ? theme.lightMenuText : `${theme.lightText} dark:text-secondary-300`}`}
													/>
													<span className={isActiveSection ? `${theme.lightMenuText} dark:text-primary-300` : ''}>{section.name}</span>
												</div>
												<FontAwesomeIcon
													icon={faChevronDown}
													className={`w-3 transition-transform ${expandedMenu === section.name ? "rotate-180" : ""} ${isActiveSection ? theme.lightMenuText : `${theme.lightText} dark:text-secondary-300`}`}
												/>
											</button>

											{expandedMenu === section.name && (
												<ul className="ml-8 mt-1 space-y-1 pl-3">
													{section.items.map((item) => {
														const isActive = currentRoute === item.path;
														return (
															<li key={item.name}
																className="relative">
																{/* Vertical line connector */}
																<div
																	className={`absolute left-[-17px] top-0 bottom-0 w-0.5 h-10 ${isActive ? theme.lightActiveBg : 'bg-gray-700'
																	}`}
																></div>

																{/* Horizontal line connector */}
																<div
																	className={`absolute left-[-17px] top-1/2 h-0.5 w-3 ${isActive ? theme.lightActiveBg : 'bg-gray-700'
																	}`}
																></div>

																<Link
																	href={item.path}
																	onClick={(e) => handleLinkClick(e, item.path)}
																	className={`flex items-center gap-2 p-2 pl-3 rounded-md text-sm relative ${theme.lightText} ${isActive
																		? `${theme.lightActiveBg} font-medium bg-[#deebfa] dark:bg-secondary-800 dark:text-primary-300`
																		: `${theme.hoverLightActiveBg} dark:text-secondary-300 dark:hover:bg-secondary-800`
																	}`}
																>
																	<FontAwesomeIcon
																		icon={item.icon}
																		className="w-4 h-4"
																	/>
																	{item.name[0].toUpperCase() + item.name.slice(1).toLowerCase()}
																</Link>
															</li>
														);
													})}
												</ul>
											)}

										</li>
									);
								} else {
									const isActiveSection = currentRoute === section.path;

									return (
										<li key={section.name}>
											<Link
												href={section.path}
											>
												<button
													className={`flex items-center justify-between ${isActiveSection && `${theme.lightActiveBg} dark:bg-secondary-800`} w-full p-2.5 mb-2 rounded-lg text-sm font-medium ${theme.lightText} 
													dark:text-secondary-200 hover:${theme.lightActiveBg} dark:hover:bg-secondary-800 transition-colors`}
												>
													<div className="flex items-center gap-3">
														<FontAwesomeIcon
															icon={section.icon}
															className={`w-4 ${isActiveSection ? 'text-primary-100' : `${theme.lightText} dark:text-secondary-300`}`}
														/>
														<span className={isActiveSection ? 'text-primary-100 dark:text-primary-300' : ''}>{section.name}</span>
													</div>
												</button>
											</Link>

										</li>
									);
								}
							})}

							{/* Upload Link */}
							{/* <li>
							 <Link
							 href="/upload"
							 onClick={(e) => handleLinkClick(e, "/upload")}
							 className={`flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors ${currentRoute === "/upload"
							 ? "bg-primary-50 text-primary-600 dark:bg-secondary-800 dark:text-primary-300"
							 : "text-gray-700 hover:bg-gray-100 dark:text-secondary-200 dark:hover:bg-secondary-800"
							 }`}
							 >
							 <FontAwesomeIcon icon={faUpload} className="w-4" />
							 <span>Upload</span>
							 </Link>
							 </li> */}
						</ul>
					</div>
				</div>

				{/* Bottom Links */}
				<div className=" border-gray-200 dark:border-secondary-700 p-3 mt-auto shrink-0">
					<ul className="space-y-1">
						<li>
							<Link
								href="/support"
								className={`flex items-center gap-3 rounded-md p-3 text-sm font-medium transition-colors ${theme.lightText} dark:text-secondary-200 hover:bg-gray-100 dark:hover:bg-secondary-800`}
							>
								<FontAwesomeIcon icon={'fa-regular fa-question-circle'}
												 className="w-4" />
								<span>Support</span>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
