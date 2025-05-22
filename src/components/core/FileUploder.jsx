import React, { useState,useEffect ,useRef} from 'react';
import Image from "next/image";
import {dmsApi} from "@/../client"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTrash, faDownload  } from "@awesome.me/kit-9b926a9ec0/icons/duotone/solid";

function FileUpload({name,fileId}){
     const[getImage,setUserImage] =useState();
      const[getId,setId] =useState(fileId);
    
     
 
      const [isImageVisible, setIsImageVisible] = useState(true);
      useEffect(() => {
        console.log(getId);
        const fetchProfileImage = async () => {
          if (fileId) {
            try {
            
              const response = await dmsApi.get(`/common/query/GetFile?fileid=${fileId}`, { responseType: 'blob' });
              const blob = response.data;
              const imageUrl = URL.createObjectURL(blob);
              setUserImage(imageUrl);
            
            } catch (error) {
              console.error("Failed to load profile image:", error);
            }
          }
        };
    
        fetchProfileImage();
      }, [fileId]);


      
      

    const handleDelete = () => {
        setId('');
        setIsImageVisible(false);
      };
      const fileInputRef = useRef();

      const resetInput = () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      const handleFileUpload = async (file) => {
        if (!file) return;
      
        const formData = new FormData();
        formData.append('file', file);
      
        try {
          const response = await dmsApi.post('/dms/query/SaveFile', formData, {
            headers: {
              'Content-Type': undefined,
            },
          });
      
          if (response.data?.fileId) {
            try {
              const response1 = await dmsApi.get(`/common/query/GetFile?fileid=${response.data.fileId}`, {
                responseType: 'blob',
              });
              const blob = response1.data;
              const imageUrl = URL.createObjectURL(blob);
              setUserImage(imageUrl);
              setId(response.data.fileId);
            } catch (error) {
              console.error("Failed to load profile image:", error);
            }
          }
        } catch (error) {
          console.error("Upload failed:", error);
        }
      };
      const handleDrop = async (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        await handleFileUpload(file);
      };
      
      const handleDragOver = (e) => {
        e.preventDefault();
      };
      
      const handleFileChange = async (e) => {
        const file = e.target.files[0];
        await handleFileUpload(file);
      };
    return(
          <div className="border border-dashed rounded-md p-4 mb-6 flex items-center justify-between"   onDrop={handleDrop}
          onDragOver={handleDragOver} >
                          <div className="flex items-center space-x-3">
                            <div className="w-16 h-16 rounded-full border flex items-center justify-center text-sm text-gray-600">
                              {isImageVisible && (
                                <Image
                                  src={getImage || "/images/user.jpeg"}
                                  className="rounded-full w-16 h-16"
                                  alt="User profile"
                                  width={70}
                                  height={70}
                                  unoptimized
                                />
                              )}
                            </div>
                            {isImageVisible && (
                              <div className="flex flex-row space-x-2">
                                <button
                                  className="text-gray-600 hover:text-red-500"
                                  onClick={handleDelete}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                                <a
                                  className="text-gray-600 hover:text-blue-500"
                                href={getImage}
                                download={'download.jpg'}
                                >
                                  <FontAwesomeIcon icon={faDownload} />
                                </a>
                              </div>
                            )}
                        </div>
                        
                        <div className="text-right text-sm text-gray-500"
                        
                      
                        >
                          <p>Drag & Drop</p>
                          <p>OR</p>
                          <label htmlFor={'FileUpload'} className="text-blue-600 underline cursor-pointer">
                            Browse file
                          </label>
                          <input
                           ref={fileInputRef}
                          id={'FileUpload'}
                          
                          type="file"
                          className="hidden"
                         
                          onChange={handleFileChange}
                        />
                          <input
                          type='text'
                          id={name}
                          name={name}
                          value={getId}
                       
                          className="hidden"
                         
                        
                        />
                                 
                          <p className="mt-1">No files uploaded.</p>
                        </div>
                      </div>



    )
}
export default FileUpload;