import Image from "next/image";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faBars, faGear} from "@awesome.me/kit-9b926a9ec0/icons/duotone/solid";
import ThemeToggle from '/src/components/theme';
import{useUser } from "@/components/UserContext"
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import {dmsApi} from "@/../client";

import {CheckBox, ContextMenu, Dropdown, Icon, InputField, Loader, Pagination, Select, Template, Text} from "~";

const Navbar = ({setTheme}) => {
    const router = useRouter();
    const {setUser}=useUser();
    function handledropdown(selected){
        selected.onClick();   
    }
  
    
    let  logout = ()=>{
        sessionStorage.removeItem("user");
        setUser(null);
        router.push("/login");

    }


    const { user } = useUser();

    const[getImage,setUserImage] =useState();

    
    const handleSearchRedirect = () => {
        localStorage.setItem("focusSearch", "true");
        router.push("/files");
      };
      
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

    return (
        <div className="w-full z-20 py-5 dark:text-gray-200 transition-colors duration-500 ease-out">
            <div className={"px-2 md:px-7 h-20 flex items-center justify-between"}>
            <div>
              <Text className="text-3xl font-bold tracking-tight">Home</Text>
              <Text className="text-muted-foreground">Welcome back to your dashboard</Text>
            </div>
                <button
                    data-collapse-toggle="navbar-solid-bg"
                    type="button"
                    id={"menu"}
                    className="py-2 px-3 text-indigo-900 rounded-lg  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 onMoblie"
                    aria-controls="navbar-solid-bg"
                    aria-expanded="false"
                >
                    <FontAwesomeIcon className={"size-4"} icon={faBars}/>
                </button>
                <div className={'hidden md:flex items-center gap-4'}>
                    <Link href='/public'
                          className={'text-gray-700 dark:text-gray-300'}><FontAwesomeIcon
                        icon={'fa-regular fa-gear'}/></Link>
                    <Link href='/public'
                          className={'text-gray-700 dark:text-gray-300 ml-3'}><FontAwesomeIcon
                        icon={'fa-regular fa-bell'}/></Link>
                    <ThemeToggle setGlobalTheme={setTheme}/>

                        <Dropdown source={[
                                        {id: "profile", name: "My Profile", icon: "fa-user", onClick:() => router.push("/login/profile")},
                                        {id: "Grantaccess", name: "Grant Access", icon: "fa-check-double"},
                                        {id: "logOut", name: "Logout", icon: "fa-sign-out",onClick:()=>{logout()}},
                                    
                                    ]}
                                            onSelect={handledropdown}
                                    >
                    <button type="button"
                            className="flex  items-center gap-3 text-sm  md:me-0  "
                            id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown"
                            data-dropdown-placement="bottom">
                        <span className="sr-only">Open user menu</span>
                        <Image
                                src={getImage || "/images/user.jpeg"}
                                className="rounded-full w-9 h-9"
                                alt="User profile"
                                width={50}
                                height={30}
                                unoptimized
                                />
                        <p className={'font-semibold text-gray-700 dark:text-gray-200'}> {user?.UserName || "Guest"}</p>
                    </button>
                    
                    </Dropdown>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
