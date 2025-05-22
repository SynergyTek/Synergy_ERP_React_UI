import Sidebar from "./sidebar";
import Navbar from "./navbar";
import Head from "next/head";
import React, {useEffect, useState} from "react";
import {config} from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'
import {ContextMenu, Loader, Toaster} from "~";
import {useSidebar} from "@/layouts/SidebarContext";
import {useUser} from "@/components/UserContext";
import {useRouter} from 'next/router';


config.autoAddCss = false
export default function RootLayout({ children }) {
    const [theme, setTheme] = useState(null);
    // const [loading, setLoading] = useState(null);


    const { sidebar } = useSidebar();
    const {user} = useUser();
    const router =useRouter();
	useEffect(()=>{
        const storedUser = sessionStorage.getItem('user');

        if (storedUser===null) {
            router.push("/login");
          //sessionStorage.removeItem("user");
        }
       
    },[])
    return (
        <>
            {(user || router.pathname === '/login')  ?
            <div className={'flex'}>
                <Head>
                    <title>Document Management System</title>
                </Head>
                {sidebar && (
                        <Sidebar/>
                    )
                }
                <div className={'flex flex-col flex-grow min-h-screen'}>
                    {sidebar && <Navbar setTheme={setTheme}/>}
                    <div className={''}>
                        {React.createElement(children.type, {theme})}
                        <Toaster richColors theme={theme}/>
                        <ContextMenu/>
                    </div>

                </div>
            </div>
                : (
                    <div className={'w-full h-full flex justify-center items-center'}>
                        <Loader />
                    </div>
                )
            }
        </>
    )
}

