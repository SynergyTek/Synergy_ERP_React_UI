"use client";

import { useState,useEffect } from "react";
import axios from "axios"; 
import Image from "next/image";
import { useRouter } from 'next/router';
import{useUser } from "@/components/UserContext"
import { useSidebar } from "@/layouts/SidebarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {dmsApi} from "@/../client";
import {
  faUser,
  faLock,
} from '@awesome.me/kit-9b926a9ec0/icons/classic/regular';

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const { setSidebar } = useSidebar();
  useEffect(() => {
    setSidebar(false);
}, [setSidebar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
   
  
    try {
    
      const response = await dmsApi.post(`/api/Authenticate/AuthenticateLogin?username=${email.toString()}&password=${password.toString()}`
     
);
  

      const result =  response.data; 
     
      console.log("Login successful:", result);
      sessionStorage.setItem("user", JSON.stringify(result));
      setUser(result);
       router.push('/');
      
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };
  
  
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 px-4">
      <div className="flex w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left - Login Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center mb-8">Login</h2>
          <form onSubmit={handleSubmit} className="w-4/5 max-w-lg flex flex-col">
            <div className="mb-4 relative">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute top-4 left-4 text-gray-400"
              />
              <input
                type="email"
                id="username"
                placeholder="User Name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4 relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute top-4 left-4 text-gray-400"
              />
              <input
                type="password"
                placeholder="Password"
                  id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

          

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 rounded-md font-semibold hover:bg-blue-800"
            >
              Login
            </button>

            <p className="text-sm text-center mt-6">
              No account yet?{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Register
              </a>
            </p>
          </form>
        </div>

        {/* Right - Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-200">
          <Image
            src="/images/dms_icon.jpeg"
            alt="Synergy Logo"
            width={240}
            height={240}
          />
        </div>
      </div>
    </div>
  );
}



export default LoginPage;
