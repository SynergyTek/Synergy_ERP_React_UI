import React, { useState,useEffect } from 'react';
import{useUser } from "@/components/UserContext"
import FileUpload from '@/components/core/FileUploder';

import { dmsApi } from 'client';
import { toast } from 'sonner';


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile'); 
  const { user } = useUser(); // might be null initially
  const [photoId, setPhotoId] = useState(user?.PhotoId);

  const [isImageVisible, setIsImageVisible] = useState(true);


  useEffect(() => {
    console.log("User", user)
    if (user) {
      setPhotoId(user.PhotoId);
      let UserName = document.querySelector('input[name="UserName"]');
      UserName.value = user.UserName;
      let JobTitle = document.querySelector('input[name="JobTitle"]');
      JobTitle.value = user.JobTitle;
    }
  }, [user]);


  const handleSubmit = async (e) => {
 
      e.preventDefault();
  
      const formData = new FormData(e.target);
  
      // Convert FormData to a plain object
      const data = {
        DataAction :2,
        UserName: formData.get("UserName"),
        JobTitle: formData.get("JobTitle"),
        PhotoId: formData.get("PhotoId"),
        Name:formData.get("UserName"),
        Email:user.Email,
        Id:user.Id,
      };
  
    
   


    try {
        const response = await dmsApi.post('/cms/user/Myprofile',data);

        const responseBody = await response.body;


        toast("Profile Updated Successfully");
      
    } catch (error) {
        console.error("Failed to submit the form", error.message || error);
    }
};



  if (!user) {
    return (
      <main className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </main>
    );
  }

  return (
    <div className="flex h-full border-b">
      <aside className="w-64 border-r  bg-white p-6">
        <h2 className="text-md font-semibold text-gray-800 mb-6">Your Details</h2>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`block text-left w-full px-2 py-1 text-sm rounded ${
              activeTab === 'profile' ? 'text-blue-600 font-medium' : 'text-gray-700'
            } hover:text-blue-500`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`block text-left w-full px-2 py-1 text-sm rounded ${
              activeTab === 'preferences' ? 'text-blue-600 font-medium' : 'text-gray-700'
            } hover:text-blue-500`}
          >
            Preferences
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex items-start justify-center overflow-auto p-40">
        <div className="w-full max-w-2xl border rounded-lg p-8 shadow-sm bg-white">
          {activeTab === 'profile' ? (
            <>
              <form onSubmit={handleSubmit} id="myform" className="w-4/5 max-w-lg flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Public Profile</h2>

              <FileUpload fileId={photoId} name="PhotoId" />

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                  name="UserName"
                    type="text"
                   
                    className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    name="JobTitle"
                    type="text"
                   
                   
                    className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 text-right">
                <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
                  Update Profile
                </button>
              </div>
              </form>
            </>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Preferences</h2>
              <p className="text-sm text-gray-600">Preferences form goes here...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
