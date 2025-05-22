import {dmsApi} from "../../../client";
import Image from 'next/image'
import React, {useEffect, useRef, useState, useMemo, forwardRef} from "react";
import {Breadcrumb, Dropdown, Icon, Separator, Slider, Text} from "~";
import {useRouter} from "next/router";
import {cn, toTitle} from "@/lib/utils";
import {Button} from "~/ui/button";
import {toast} from "sonner";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "~/ui/resizable";
import NtsPreview from "~/core/NtsPreview";
import NtsEdit from "~/core/NtsEdit";
import {ContextMenuTrigger} from "~/core/ContextMenu";
import dynamic from 'next/dynamic';

// Dynamically import components that use browser APIs
const PDFViewer = dynamic(() => import('./PDFViewer'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading PDF viewer...</div>
});

// Create a new file for PDFViewer component
const ExcelViewer = dynamic(() => import('./ExcelViewer'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading Excel viewer...</div>
});

const DocxViewer = dynamic(() => import('./DocxViewer'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading Word viewer...</div>
});

const sourceMap = {
	default: "/dms/workspace/GetParentWorkspace?userId=45bba746-3309-49b7-9c03-b5793369d73c&portalName=DMS",
	archive: "/dms/query/GetArchivedDocumentData?userId=45bba746-3309-49b7-9c03-b5793369d73c",
	bin: "/dms/query/GetBinDocumentData?userId=45bba746-3309-49b7-9c03-b5793369d73c"
}
const rootSource = "/dms/workspace/GetParentWorkspace?userId=45bba746-3309-49b7-9c03-b5793369d73c&portalName=DMS"
const iconMap = {
	"folder": "folder",
	"GENERAL_FOLDER": "folder",
	"file": "file",
	"GENERAL_DOCUMENT": "file",
	"workspace": "folders",
	"WORKSPACE_GENERAL": "folders",
	".pdf": "file-pdf",
	".doc": "file-word",
	".docx": "file-word",
	".xls": "file-excel",
	".xlsx": "file-excel",
	".ppt": "file-powerpoint",
	".pptx": "file-powerpoint",
	".zip": "file-archive",
	".rar": "file-archive",
	".7z": "file-archive",
	".jpg": "file-image",
	".jpeg": "file-image",
	".png": "file-image",
}
const userId = "45bba746-3309-49b7-9c03-b5793369d73c"
const textScale = {
	1: "text-xs",
	2: "text-xs",
	3: "text-sm",
	4: "text-sm",
	5: "text-base",
	6: "text-base",
	7: "text-md",
	8: "text-md",
	9: "text-xl",
	10: "text-xl",
}
const widthScale = {
	1: "w-[7ch]",
	2: "w-[8ch]",
	3: "w-[8ch]",
	4: "w-[9ch]",
	5: "w-[9ch]",
	6: "w-[10ch]",
	7: "w-[12ch]",
	8: "w-[13ch]",
	9: "w-[14ch]",
	10: "w-[15ch]",
}

const handleFileDownload = async (fileId, fileName) => {
    try {
        if (!fileId) {
            toast.error("No file ID provided.");
            return;
        }

        const response = await dmsApi.get(`/dms/query/GetFileMongo`, {
            params: { fileId },
            responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: response.headers['content-type'] });

        // Try to get filename from content-disposition header
        const contentDisposition = response.headers['content-disposition'];
        let downloadFileName = fileName;
        if (contentDisposition && contentDisposition.includes("filename=")) {
            downloadFileName = contentDisposition.split("filename=")[1].split(";")[0].replace(/"/g, '');
        }

        // Create a hidden anchor element and trigger download
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = window.URL.createObjectURL(blob);
        link.download = downloadFileName;
        link.target = '_self'; // Force same tab
        document.body.appendChild(link);
        link.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        }, 100);

        toast.success("Download started!");
    } catch (error) {
        console.error("Download failed:", error);
        toast.error("Failed to download file");
    }
};

const Item = forwardRef(({ scale, id, type, title, isImage,mode,NoteId,setData, imageUrl, onClick, onDoubleClick,archive, clipboard, setClipboard,refreshData,item,setCurrentFile,setCurrentEditFile, name, router,  path, setPath, breadcrumbIndex, setBreadcrumbIndex, breadcrumbHistory, setBreadcrumbHistory, setLevel,level,sortOrder, setSortOrder, sortField, setSortField, setSummaryData,
    setShowSummaryModal, setPreviewData, setPreviewModalOpen, ...props }, ref) => {    ref = ref || useRef();
    const onEdit = (id) => {
        console.log(id);
        router.push(
            {
                pathname: "/masters/workspace/manage",
                query: { id },
            },
            "/masters/workspace/manage"
        );
    };
    const handleViewDetails = () => {
        const templateCode = item?.TemplateCode;
      
        const isDocument = ["GENERAL_DOCUMENT", "file"].includes(templateCode);
        const isFolder = ["GENERAL_FOLDER", "folder"].includes(templateCode);
        const isWorkspace = ["WORKSPACE_GENERAL", "workspace"].includes(templateCode);
      
        if (isDocument || isFolder || isWorkspace) {
          setCurrentFile(item); // ✅ allow preview for all
          return;
        }
      
        toast.error("Unknown item type. Cannot open.");
      };
       const handleViewSummary = async () => {
        try {
            const parentId = item?.id || item?.key || item?.Id;
            const userId= "45bba746-3309-49b7-9c03-b5793369d73c";
            console.log(parentId);
            const response = await dmsApi.get('/dms/query/GetAllPermittedChildDocumentCount', {
                params: { userId,parentId }
            });
    
            const data = response.data;
    
            if (data.length > 0) {
                setSummaryData(data);
                setShowSummaryModal(true);
            } else {
                toast.warning("No Document Found!");
            }
        } catch (error) {
            console.error("Error fetching summary:", error);
            toast.error("Failed to fetch document summary");
        }
    }; /*
    
  
      const handleViewSummary = async () => {
        const dummy = [
            { Name: "Invoices", Count: 5 },
            { Name: "Reports", Count: 12 },
            { Name: "Contracts", Count: 3 }
        ];
        setSummaryData(dummy);
        setShowSummaryModal(true);
    };*/
    
      
    // Define context menu options based on type
   
    let contextMenuOptions = [];
    //const router = useRouter();
    const [checkedOutMap, setCheckedOutMap] = useState({});
    
    
    if ((type === "workspace" || type === "WORKSPACE_GENERAL") && !archive && mode === 'default') {
        contextMenuOptions = [
            {
                label: "Workspace",
                icon: "folders",
                children: [
                    {
                        label: "Create Workspace",
                        icon: "plus",
                        onClick: () => router.push(`/masters/workspace/manage`),
                    },
                    {
                        label: "Edit Workspace",
                        icon: "pencil",
                        onClick: ({ data }) => onEdit?.(data.id),
                    },
                ],
            },
            {
                label: "Folder",
                icon: "folder",
                children: [
                    {
                        label: "Create Folder",
                        icon: "plus",
                        onClick: function () {

                            router.push({
                                pathname: "/masters/folder/manage",
                                query: {currentDirectory: item.id || item.key || item.Id},
                            })
                        }
                    },
                    {
                        label: "Upload Folder",
                        icon: "folder-plus",
                        onClick: () => {
                            const folderId = id;

                            // Fix: get actual workspace ID from breadcrumbs
                            const workspaceNode = path?.find(p => p.href !== "/files");
                            const workspaceId = workspaceNode?.href || '';

                            console.log("folder:", folderId, "workspace:", workspaceId);

                            router.push({
                                pathname: "/files/upload-folder",
                                query: {
                                    folderId,
                                    workspaceId
                                }
                            });
                        }
                    },
                ],
            },
            {
                label: "Permission",
                icon: "shield",
                children: [
                    {
                        label: "Manage Permission",
                        icon: "settings",
                        onClick: ()    => {
                            router.push({
                                pathname: "/masters/workspace/manage-permissions",
                                query: { NoteId: item.id || item.key || item.Id , mode : true},
                            })
                            toast.success("Manage Permission triggered");
                        }
                    },
                    {
                        label: "View Permission",
                        icon: "eye",
                        onClick: function (){
                            router.push({
                                pathname: "/masters/workspace/view-permissions",
                                query: { id: item.id || item.key || item.Id },
                            })
                            toast.success("View Permission triggered");
                        }
                    },
                ],
            },
            {
                label: "Actions",
                icon: "ellipsis",
                children: [
                    {
                        label: "Cut",
                        icon: "scissors",
                        onClick: () => {
                            const clip = { mode: "cut", sourceId: id };
                            localStorage.setItem("clipboard", JSON.stringify(clip));
                            toast.success("Item cut");
                        }
                    },
                    {
                        label: "Copy",
                        icon: "copy",
                        onClick: () => {
                            const clip = { mode: "copy", sourceId: id };
                            localStorage.setItem("clipboard", JSON.stringify(clip));
                            toast.success("Item copied");
                        }
                    },
                    {
                        label: "Paste",
                        icon: "paste",
                        onClick: async () => {
                            console.log("Clipboard content:", localStorage.getItem("clipboard"));
                            const clipboard = JSON.parse(localStorage.getItem("clipboard"));

                            if (!clipboard || !clipboard.sourceId) {
                                toast.error("Clipboard is empty");
                                return;
                            }

                            const endpoint = clipboard.mode === "copy"
                                ? "/dms/query/CopyNote"
                                : "/dms/query/MoveNote";

                            const params = {
                                sourceId: clipboard.sourceId,
                                targetId: id,
                                ...(clipboard.mode === "copy" && { userId }),
                            };

                            try {
                                await dmsApi.get(endpoint, { params });
                                toast.success(`${clipboard.mode === "copy" ? "Copied" : "Moved"} successfully`);
                                localStorage.removeItem("clipboard");
                                refreshData();
                            } catch (error) {
                                console.error(error);
                                toast.error("Failed to paste item");
                            }
                        }
                    },
                    {
                        label: "Delete",
                        icon: "trash",
                        onClick: async () => {
                            try {
                              await dmsApi.get(`/dms/query/DeleteNote`, { params: { id } });
                              toast.success("Item deleted successfully");
                              refreshData();
                            } catch (error) {
                              console.error(error);
                              toast.error("Failed to delete item");
                            }
                          },
                    },
                    {
                        label: "Archive",
                        icon: "archive",
                        onClick: async () => {
                            try {
                              await dmsApi.get(`/dms/query/ArchiveNote`, { params: { id } });
                              toast.success("Item archived successfully");
                              refreshData();
                            } catch (error) {
                              console.error(error);
                              toast.error("Failed to archive item");
                            }
                    },
                    },
                   
                ],
            },
            {
                label: "Download",
                icon: "download",
                onClick: () => {
                    const noteId = NoteId || id;
                    const safeTitle = title || "MyDocuments"; // ✅ fallback if title is undefined
            
                    console.log("Downloading noteId:", noteId, "title:", safeTitle);
            
                    dmsApi.get(`/dms/query/DownloadAll`, {
                        params: {
                            noteid: noteId,
                            name: safeTitle,
                            userId: "45bba746-3309-49b7-9c03-b5793369d73c"
                        },
                        responseType: 'blob',
                    })
                    .then(response => {
                        const blob = new Blob([response.data]);
                        const url = window.URL.createObjectURL(blob);
            
                        let fileName = safeTitle + ".zip";
                        const contentDisposition = response.headers['content-disposition'];
                        if (contentDisposition && contentDisposition.includes("filename=")) {
                            fileName = contentDisposition.split("filename=")[1].split(";")[0].replace(/"/g, '');
                        }
            
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", fileName);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
            
                        window.URL.revokeObjectURL(url);
                        toast.success("Downloaded successfully!");
                    })
                    .catch(error => {
                        console.error("Download failed:", error);
                        toast.error("Failed to download document.");
                    });
                }
            },
            {
                label: "View Details",
                icon: "eye",
                onClick: handleViewDetails,
            },
            {
                label: "View Summary",
                icon: "list",
                onClick: handleViewSummary,
            },
            {
                label: "Sort",
                icon: "sort",
                children: [
                    {
                        label: "Sort by Name (A–Z)",
                        icon: "arrow-up-a-z",
                        onClick: () => {
                          setSortField("title");
                          setSortOrder("asc");
                          toast.success("Sorted A–Z by name");
                        },
                      },
                      {
                        label: "Sort by Name (Z–A)",
                        icon: "arrow-down-z-a",
                        onClick: () => {
                          setSortField("title");
                          setSortOrder("desc");
                          toast.success("Sorted Z–A by name");
                        },
                      },
                      {
                        label: "Sort by Date (Oldest)",
                        icon: "clock-rotate-left",
                        onClick: () => {
                          setSortField("created");
                          setSortOrder("asc");
                          toast.success("Sorted by oldest first");
                        },
                      },
                      {
                        label: "Sort by Date (Newest)",
                        icon: "clock",
                        onClick: () => {
                          setSortField("created");
                          setSortOrder("desc");
                          toast.success("Sorted by newest first");
                        },
                      }
                      
                ],
              },
              
        ];
    } else if (mode === 'bin') {
        contextMenuOptions = [
            {
                label: "Restore",
                icon: "history",
                onClick: () => {
                    const noteId = NoteId; 
                
                    dmsApi.get(`/dms/query/RestorebinDocument?NoteId=${noteId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(response => {
                        toast.success("Document restored successfully!");
                        setData(prevData => {
                            return prevData.filter(item => item.NoteId !== noteId);
                        });
                    })
                    .catch(error => {
                        console.error("Restore failed:", error);
                        toast.error("Failed to restore document.");
                    });
                },
             
            },
        ];
    } else if (archive === true) {
        contextMenuOptions = [
            {
                label: "View Details",
                icon: "eye",
                onClick: () => toast.success("View Details triggered"),
               
         
            },
            {
                label: "Restore",
                icon: "history",
                onClick: () => {
                    const noteId = NoteId; 
                
                    dmsApi.get(`/dms/query/RestoreArchivedDocument?NoteId=${noteId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(response => {
                        toast.success("Document restored successfully!");
                        setData(prevData => {
                            return prevData.filter(item => item.NoteId !== noteId);
                        });
                    })
                    .catch(error => {
                        console.error("Restore failed:", error);
                        toast.error("Failed to restore document.");
                    });
                },
            },
            {
                label: "Delete",
                icon: "trash",
                onClick: () => {
                    const noteId = NoteId; 
                    
                    dmsApi.get(`/dms/query/DeleteDocument?NoteId=${noteId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(response => {
                        toast.success("Document Delete successfully!");
                        
                        // Remove the deleted item from `data`
                        setData(prevData => {
                            return prevData.filter(item => item.NoteId !== noteId);
                        });
            
                          // This will re-fetch data after deleting if needed
                    })
                    .catch(error => {
                        console.error("Delete failed:", error);
                        toast.error("Delete document.");
                    });
                },
            },
            
        ];
    }

	
    else if (type === "folder" || type === "GENERAL_FOLDER") {
        contextMenuOptions = [
            {
                label: "Folder",
                icon: "folder",
                children: [
                    {
                        label: "Create Folder",
                        icon: "plus",
                        onClick: function () {

                            router.push({
                                pathname: "/masters/folder/manage",
                                query: {currentDirectory: item.id || item.key || item.Id},
                            })
                        }
                    },
                    {
                        label: "Edit Folder",
                        icon: "folder-plus",
                        onClick: function () {

                            router.push({
                                pathname: "/masters/folder/manage",
                                query: {id: item.id || item.key || item.Id},
                                currentDirectory: item.parentId || item.parentKey || item.ParentId 
                            })
                        }
                    },
                ],
            },
            {
                label: "Upload",
                icon: "upload",
                children: [
                    {
                        label: "Upload Files",
                        icon: "file-plus",
                        onClick: () => {
                            const folderId = id;
                        
                            // Fix: get actual workspace ID from breadcrumbs
                            const workspaceNode = path?.find(p => p.href !== "/files");
                            const workspaceId = workspaceNode?.href || '';
                        
                            console.log("folder:", folderId, "workspace:", workspaceId);
                        
                            router.push({
                              pathname: "/files/upload",
                              query: {
                                folderId,
                                workspaceId
                              }
                            });
                          }
                    },
                    {
                        label: "Upload Folder",
                        icon: "folder-plus",
                        onClick: () => {
                            const folderId = id;
                        
                            // Fix: get actual workspace ID from breadcrumbs
                            const workspaceNode = path?.find(p => p.href !== "/files");
                            const workspaceId = workspaceNode?.href || '';
                        
                            console.log("folder:", folderId, "workspace:", workspaceId);
                        
                            router.push({
                              pathname: "/files/upload-folder",
                              query: {
                                folderId,
                                workspaceId
                              }
                            });
                          }
                    },
                ],
            },
            {
                label: "Permission",
                icon: "shield",
                children: [
                    {
                        label: "Manage Permission",
                        icon: "settings",
                        onClick: function () {

                            router.push({
                                pathname: "/masters/workspace/manage-permissions",
                                query: { NoteId: item.id || item.key || item.Id , mode : true},
                            })
                            toast.success("Manage Permission triggered");
                        }
                    },
                    {
                        label: "View Permission",
                        icon: "eye",
                        onClick: function () {
                           
                            router.push({
                                pathname: "/masters/workspace/view-permissions",
                                query: { id: item.id || item.key || item.Id },
                            })
                            toast.success("View Permission triggered");
                        } 
                    },
                ],
            },
            {
                label: "Actions",
                icon: "ellipsis",
                children: [
                    {
                        label: "Cut",
                        icon: "scissors",
                        onClick: () => {
                            const clip = { mode: "cut", sourceId: id };
                            localStorage.setItem("clipboard", JSON.stringify(clip));
                            toast.success("Item cut");
                          }
                      },
                      {
                        label: "Copy",
                        icon: "copy",
                        onClick: () => {
                            const clip = { mode: "copy", sourceId: id };
                            localStorage.setItem("clipboard", JSON.stringify(clip));
                            toast.success("Item copied");
                          }
                          
                      },
                      {
                        label: "Paste",
                        icon: "paste",
                        onClick: async () => {
                            const clipboard = JSON.parse(localStorage.getItem("clipboard"));
                          
                            if (!clipboard || !clipboard.sourceId) {
                              toast.error("Clipboard is empty");
                              return;
                            }
                          
                            const endpoint = clipboard.mode === "copy"
                              ? "/dms/query/CopyNote"
                              : "/dms/query/MoveNote";
                          
                            const params = {
                              sourceId: clipboard.sourceId,
                              targetId: id,
                              ...(clipboard.mode === "copy" && { userId }),
                            };
                          
                            try {
                              await dmsApi.get(endpoint, { params });
                              toast.success(`${clipboard.mode === "copy" ? "Copied" : "Moved"} successfully`);
                              localStorage.removeItem("clipboard");
                              refreshData();
                            } catch (error) {
                              console.error(error);
                              toast.error("Failed to paste item");
                            }
                          }
                          
                      },
                      
                    {
                        label: "Delete",
                        icon: "trash",
                        onClick: async () => {
                            try {
                              await dmsApi.get(`/dms/query/DeleteNote`, { params: { id } });
                              toast.success("Item deleted successfully");
                              refreshData();
                            } catch (error) {
                              console.error(error);
                              toast.error("Failed to delete item");
                            }
                          },
                    },
                    {
                        label: "Archive",
                        icon: "archive",
                        onClick: async () => {
                            try {
                              await dmsApi.get(`/dms/query/ArchiveNote`, { params: { id } });
                              toast.success("Item archived successfully");
                              refreshData();
                            } catch (error) {
                              console.error(error);
                              toast.error("Failed to archive item");
                            }
                    },
                    },
                    
                ],
            },
            {
                label: "Download",
                icon: "download",
                onClick: () => {
                    const noteId = NoteId || id;
                    const safeTitle = title || "MyDocuments"; // ✅ fallback if title is undefined
            
                    console.log("Downloading noteId:", noteId, "title:", safeTitle);
            
                    dmsApi.get(`/dms/query/DownloadAll`, {
                        params: {
                            noteid: noteId,
                            name: safeTitle,
                            userId: "45bba746-3309-49b7-9c03-b5793369d73c"
                        },
                        responseType: 'blob',
                    })
                    .then(response => {
                        const blob = new Blob([response.data]);
                        const url = window.URL.createObjectURL(blob);
            
                        let fileName = safeTitle + ".zip";
                        const contentDisposition = response.headers['content-disposition'];
                        if (contentDisposition && contentDisposition.includes("filename=")) {
                            fileName = contentDisposition.split("filename=")[1].split(";")[0].replace(/"/g, '');
                        }
            
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", fileName);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
            
                        window.URL.revokeObjectURL(url);
                        toast.success("Downloaded successfully!");
                    })
                    .catch(error => {
                        console.error("Download failed:", error);
                        toast.error("Failed to download document.");
                    });
                }
            },
            
            {
                label: "View Details",
                icon: "eye",
                onClick: handleViewDetails,
            },
            {
                label: "View Summary",
                icon: "list",
                onClick: handleViewSummary,
            },

        ];
    }
    
    else if ((type === "file" || type === "GENERAL_DOCUMENT")) {
        const isCheckedOut = checkedOutMap[id] ?? false;

        const toggleCheckStatus = () => {
            setCheckedOutMap(prev => ({
                ...prev,
                [id]: !isCheckedOut,
            }));
            toast.success(`Item ${!isCheckedOut ? "checked out" : "checked in"}`);
        };

        const restrictedActions = isCheckedOut ? [] : [
            {
                label: "Cut",
                icon: "scissors",
                onClick: () => {
                    const clip = { mode: "cut", sourceId: id };
                    localStorage.setItem("clipboard", JSON.stringify(clip));
                    toast.success("Item cut");
                },
            },
            {
                label: "Copy",
                icon: "copy",
                onClick: () => {
                    const clip = { mode: "copy", sourceId: id };
                    localStorage.setItem("clipboard", JSON.stringify(clip));
                    toast.success("Item copied");
                },
            },
            {
                label: "Paste",
                icon: "paste",
                onClick: async () => {
                    const clipboard = JSON.parse(localStorage.getItem("clipboard"));
                    if (!clipboard || !clipboard.sourceId) {
                        toast.error("Clipboard is empty");
                        return;
                    }

                    const endpoint = clipboard.mode === "copy"
                        ? "/dms/query/CopyNote"
                        : "/dms/query/MoveNote";

                    const params = {
                        sourceId: clipboard.sourceId,
                        targetId: id,
                        ...(clipboard.mode === "copy" && { userId }),
                    };

                    try {
                        await dmsApi.get(endpoint, { params });
                        toast.success(`${clipboard.mode === "copy" ? "Copied" : "Moved"} successfully`);
                        localStorage.removeItem("clipboard");
                        refreshData();
                    } catch (error) {
                        console.error(error);
                        toast.error("Failed to paste item");
                    }
                }
            },
            {
                label: "Delete",
                icon: "trash",
                onClick: async () => {
                    try {
                        await dmsApi.get(`/dms/query/DeleteNote`, { params: { id } });
                        toast.success("Item deleted successfully");
                        refreshData();
                    } catch (error) {
                        console.error(error);
                        toast.error("Failed to delete item");
                    }
                },
            },
            {
                label: "Archive",
                icon: "archive",
                onClick: async () => {
                    try {
                        await dmsApi.get(`/dms/query/ArchiveNote`, { params: { id } });
                        toast.success("Item archived successfully");
                        refreshData();
                    } catch (error) {
                        console.error(error);
                        toast.error("Failed to archive item");
                    }
                },
            }
        ];

        contextMenuOptions = [
     
            {
                label: "Document",      
                icon: "file-text",
                children: [
                    {
                        label: "View Details",
                        icon: "eye",
                        onClick: () => {
                            if (item) {
                                setCurrentFile(item); // 👈 Same as double-click logic
                            } else {
                                toast.error("File data not available");
                            }
                        }
                    },
                    {
                        label: "Edit Document",
                        icon: "pencil",
                        onClick: () => {
                            if (item) {
                                setCurrentEditFile({
                                    Id: item.id || item.key || item.Id,
                                    TemplateCode: item.TemplateCode,
                                    NtsType: "Note", // optional
                                });
                            } else {
                                toast.error("Document not found for editing.");
                            }
                        }
                    },
                ],
            },
            {
                label: "Permission",
                icon: "shield",
                children: [
                    {
                        label: "Manage Permission",
                        icon: "settings",
                        onClick: () => {
                            router.push({
                                pathname: "/masters/workspace/manage-permissions",
                                query: { NoteId: item.id || item.key || item.Id , mode : true},
                            })
                            toast.success("Manage Permission triggered");
                        } 
                    },
                    {
                        label: "View Permission",
                        icon: "eye",
                        onClick: function (){
                            router.push({
                                pathname: "/masters/workspace/view-permissions",
                                query: { id: item.id || item.key || item.Id },
                            })
                            toast.success("View Permission triggered");
                        } 
                    },
                ],
            },
          /*   {
                label: "Workflow",
                icon: "random",
                children: [
                    {
                        label: "Raise Approval Request",
                        icon: "arrow-up-from-square",
                        onClick: () => toast.success("Raise Approval Request triggered"),
                    },
                    {
                        label: "View Approval Request",
                        icon: "eye",
                        onClick: () => toast.success("View Approval Request triggered"),
                    },
                ],
            }, */


            {
                label: "Actions",
                icon: "ellipsis",
                children: [
                    {
                        label: isCheckedOut ? "Check In" : "Check Out",
                        icon: isCheckedOut ? "arrow-down-to-line" : "arrow-up-from-line",
                        onClick: toggleCheckStatus,
                    },
                    ...restrictedActions,
                ]
            },
            {
                label: "Download",
                icon: "download",
                onClick: () => {
                    const fileId = props.FileId;
                    const fileName = title || "downloaded-file";
                    handleFileDownload(fileId, fileName);
                }
            },
            {
               
                label: "Attachment",
                icon: "paperclip",
                children: [
                    {
                        label: "Preview",
                        icon: "magnifying-glass",
                        onClick: async () => {
                          const fileId = props.FileId;
                          if (!fileId) {
                            toast.error("No file ID provided.");
                            return;
                          }
                      
                          try {
                            const response = await dmsApi.get("/dms/query/AttachmentPreview", {
                              params: { fileId },
                            });
                      
                            const { success, fileBytes, fileName } = response.data;
                      
                            if (!success || !fileBytes) {
                              toast.error("Preview failed: file not found.");
                              return;
                            }
                      
                            // Convert base64 to blob
                            const byteCharacters = atob(fileBytes);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray]);
                            const url = window.URL.createObjectURL(blob);
                            const extension = fileName.split('.').pop().toLowerCase();

                            // Set preview data without any file type restriction
                            setPreviewData({
                                url,
                                fileName,
                                type: extension,
                                fileId
                            });
                            setPreviewModalOpen(true);
                          } catch (error) {
                            console.error("Preview failed:", error);
                            toast.error("Failed to preview document.");
                          }
                        }
                    },
                    {
                        label: "Download",
                        icon: "download",
                        onClick: () => {
                            const fileId = props.FileId;
                            const fileName = title || "downloaded-file";
                            handleFileDownload(fileId, fileName);
                        }
                    },
                ],
            },
            {
                label: "Entity Graph",
                icon: "diagram-project", // You might need to install a specific icon
                onClick: () => toast.success("Entity Graph triggered"),
            },
        ];
    }

    return (
        <ContextMenuTrigger options={contextMenuOptions} context={{ id, type, title }}>
            <div
                role={"button"}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                title={title}
                ref={ref}
                className={`transition-all text-secondary-600 hover:text-primary-800 dark:text-secondary-300 dark:hover:text-primary-300  flex flex-col justify-center items-center hover:bg-primary-200 bg-opacity-80 dark:hover:bg-primary-950 dark:bg-opacity-80 p-4 rounded gap-2`}
            >
                {isImage ?  <div className={`flex justify-center align-middle m-2 ${cn(textScale[scale], widthScale[scale])}`}>
                        <img src={imageUrl} className="object-contain max-w-full max-h-full h-[100px] w-[100px]"  />
                    </div>
                    :
                    <Icon
                        icon={
                            props.skeleton
                                ? "folder"
                                : iconMap[props.extension] || iconMap[type] || "file-exclamation"
                        }
                        variant={"fal"}
                        hover={{
                            variant: "fad",
                            container: ref,
                        }}
                        size={`${scale == 1 ? "" : scale}xl`}
                        skeleton={props.skeleton}
                    />
                }
                {props.rename ? (
                    <input value={title} className={"border-1 radius text-center"} autoFocus={true} />
                ) : (
                    <Text wrap={"break"} className={cn(textScale[scale], widthScale[scale])} skeleton={props.skeleton}>
                        {title}
                    </Text>
                )}
            </div>
        </ContextMenuTrigger>
    );
});

const PreviewModal = ({ isOpen, onClose, previewData }) => {
    if (!isOpen || !previewData) return null;
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const renderPreview = () => {
        if (!isClient) return <div>Loading...</div>;

        const extension = previewData.type.toLowerCase();

        // Excel Preview
        if (['xlsx', 'xls'].includes(extension)) {
            return <ExcelViewer url={previewData.url} />;
        }

        // PDF Preview
        if (extension === 'pdf') {
            return <PDFViewer url={previewData.url} />;
        }

        // Word Preview
        if (extension === 'docx') {
            return <DocxViewer url={previewData.url} />;
        }

        // Image Preview
        if (['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(extension)) {
            return (
                <div className="flex items-center justify-center h-full">
                    <img
                        src={previewData.url}
                        alt={previewData.fileName}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            );
        }

        // For other file types, show a download button
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <Icon icon="file" size="4xl" />
                <p className="text-lg">This file type cannot be previewed</p>
                <Button
                    icon="download"
                    onClick={handleDownload}
                    variant="primary"
                >
                    Download File
                </Button>
            </div>
        );
    };

    const handleDownload = async () => {
        try {
            const fileId = previewData.fileId;
            if (!fileId) {
                toast.error("No file ID provided.");
                return;
            }

            const response = await dmsApi.get(`/dms/query/GetFileMongo`, {
                params: { fileId },
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.target = '_self'; // Force same tab

            // Try to get filename from content-disposition header
            const contentDisposition = response.headers['content-disposition'];
            let fileName = previewData.fileName;
            if (contentDisposition && contentDisposition.includes("filename=")) {
                fileName = contentDisposition.split("filename=")[1].split(";")[0].replace(/"/g, '');
            }

            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.success("Download started!");
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Failed to download file");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg shadow-lg w-[90vw] h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <Icon 
                            icon={iconMap[previewData.type.toLowerCase()] || "file"} 
                            size="xl"
                        />
                        <h2 className="text-lg font-bold">{previewData.fileName}</h2>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            icon="download"
                            variant="tertiary"
                            onClick={handleDownload}
                        />
                        <Button
                            icon="xmark"
                            variant="tertiary"
                            onClick={onClose}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-auto border rounded">
                    {renderPreview()}
                </div>
            </div>
        </div>
    );
};

function FileExplorer({filter, mode = "default", props}) {
	const router = useRouter()
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(null);
	const [level, setLevel] = useState(0);
	const [scale, setScale] = useState(4);
	const [structure, setStructure] = useState(null);
	const [path, setPath] = useState([{href: "/files", title: "Home", icon: "home"}]);
	const [currentFile, setCurrentFile] = useState(null);
	const [currentFolder, setCurrentFolder] = useState(null);
    const [clipboard, setClipboard] = useState(null);
	const [source, setSource] = useState(sourceMap[mode]);
	const [previewFile, setpreviewFile] = useState(null);
	const[imageset,setCurrentimage]=useState('')
	const {currentDirectory} = router.query
	const fileExplorerPanelRef = useRef(null)
    const [breadcrumbIndex, setBreadcrumbIndex] = useState(0);
    const [breadcrumbHistory, setBreadcrumbHistory] = useState([
        [{ href: "/files", title: "Home", icon: "home" }]
    ]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortField, setSortField] = useState("title");
    const [summaryData, setSummaryData] = useState([]);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [currentEditFile, setCurrentEditFile] = useState(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);

      

      useEffect(() => {
        const newPath = breadcrumbHistory[breadcrumbIndex];
        if (newPath) {
          setPath(newPath);
          const last = newPath[newPath.length - 1];
          setCurrentFolder(last?.href);
        }
      }, [breadcrumbIndex]);
      


      const refreshData = () => {
        setSource(prev => prev.includes("?") ? `${prev}&_r=${Date.now()}` : `${prev}?_r=${Date.now()}`);
      };
      

    const setFolderFromPath = (newPath) => {
        debugger
        const last = newPath[newPath.length - 1];
        const path = last?.href;
    
        if (path !== currentFolder) {
            setCurrentFolder(path);
        }
    };
    

    
    const resetToHome = () => {
        const homePath = [{ href: "/files", title: "Home", icon: "home" }];
        setPath(homePath);
        setBreadcrumbHistory([homePath]);
        setBreadcrumbIndex(0);
        setLevel(0);
        setCurrentFolder("/"); // or null if root loads differently
    };
    useEffect(() => {
        if (router.pathname === "/files" && !router.query.currentDirectory) {
            resetToHome();
        }
    }, [router.pathname, router.query]);
        

    // const handlePathClick = (clickedItem, index) => {
    //     const newPath = path.slice(0, index + 1);
    //     setPath(newPath);
    //     setCurrentFolder(clickedItem.href);
    //     setBreadcrumbHistory(prev => [...prev.slice(0, breadcrumbIndex + 1), newPath]);
    //     setBreadcrumbIndex(prev => prev + 1);
    // };
    
    const handlePathClick = (clickedItem, index) => {
        if (clickedItem.href === "/files" && index === 0) {
            resetToHome(); 
        } else {
            const newPath = path.slice(0, index + 1);
            setPath(newPath);
            setCurrentFolder(clickedItem.href);
            setBreadcrumbHistory(prev => [...prev.slice(0, index + 1)]);
            setBreadcrumbIndex(index);
        }
    };
    


	const createNewItem = (selected) => {
		let itemType = selected?.id
		switch (selected?.id) {
			case "file":
				if (level === 0) {
					return toast.error(`You cannot create a ${selected.id} in the root workspace`)
				}
				itemType = "GENERAL_DOCUMENT"
				break;
			case "folder":
				if (level === 0) {
					return toast.error(`You cannot create a ${selected.id} in the root workspace`)
				}
				itemType = "GENERAL_FOLDER"
				break;
			case "workspace":
				console.log("workspace")
				itemType = "WORKSPACE_GENERAL"
				break;
		}
		let temp = Array.from(data) || []
		temp.push({
			TemplateCode: itemType,
			Name: "New Item",
			id: "new",
			newlyCreated: true,
            
			
		})
		setData(temp)
	}
	useEffect(() => {
		setSource(filter || rootSource)
	}, [filter]);
	useEffect(() => {
		if (!mode) return;
		setSource(sourceMap[mode])
	}, [mode]);
    useMemo(() => {
        if (!data) return;

        const processData = async () => {
            const sortedData = [...data].sort((a, b) => {
                const getTitle = (item) =>
                    item.Name || item.title || item.FileName || item.DocumentName || "Untitled";
            
                const getCreatedDate = (item) => {
                    const raw = item.CreatedDate || item.createdAt;
                    const parsed = raw ? Date.parse(raw) : NaN;
                    return isNaN(parsed) ? null : new Date(parsed);
                };
            
                if (sortField === "title") {
                    const aVal = getTitle(a);
                    const bVal = getTitle(b);
                    return sortOrder === "asc"
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                }
            
                if (sortField === "created") {
                    console.log("CreatedDate:", a.CreatedDate, "| createdAt:", a.createdAt);
                    const aVal = getCreatedDate(a);
                    const bVal = getCreatedDate(b);
            
                    if (!aVal && !bVal) return 0;
                    if (!aVal) return sortOrder === "asc" ? 1 : -1;
                    if (!bVal) return sortOrder === "asc" ? -1 : 1;
            
                    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
                }
            
                // 🔁 OLD FUNCTIONALITY: default sort by file name/title ascending
                const aFileName = a.Name || a.title || a.FileName || a.DocumentName || "Untitled";
                const bFileName = b.Name || b.title || b.FileName || b.DocumentName || "Untitled";
                return aFileName.localeCompare(bFileName);
            });
            

            const promises = sortedData.map(async (item, index) => {
                console.log(item); 
                const rawTitle = (item.title || item.Name || item.FileName || '').trim().toLowerCase();
                const fileExtension = rawTitle.includes('.') ? '.' + rawTitle.split('.').pop() : '';

                item.isImg = false;
                item.imgUrl = '';

                // Image logic
                if (
                    item.TemplateCode === 'GENERAL_DOCUMENT' &&
                    ['.png', '.jpg', '.jpeg'].includes(fileExtension)
                ) {
                    try {
                        const url = `/common/query/GetFile?fileid=${item.FileId}`;
                        const response = await dmsApi.get(url, { responseType: 'blob' });
                        const blob = response.data;
                        item.imgUrl = URL.createObjectURL(blob);
                        item.isImg = true;
                    } catch (error) {
                        console.error('Error loading image:', error);

                        item.isImg = true;
                    }
                }

                if (level === 0) {
                    item.TemplateCode = "WORKSPACE_GENERAL";
                }
                const itemId = item.id || item.key || item.Id;
                return {
                    index,
                    element: (
                        <Item
                        id={itemId}
                            key={item.key || index}
                            title={item.Name || item.title || item.FileName || item.DocumentName || "Untitled"}
                            type={item.FileName ? "file" : item.TemplateCode}
                            isImage={item.isImg}
                            imageUrl={item.imgUrl}
                            archive={item.IsArchived}
                            mode={mode}
                            NoteId={item.NoteId}
                            setData={setData} 
                            extension={fileExtension}
                            scale={scale}
                            rename={item.newlyCreated}
                            clipboard={clipboard}
                            setClipboard={setClipboard}
                            item={item}
                            setCurrentFile={setCurrentFile}
                            refreshData={refreshData}
                            FileId={item.FileId}
                          
                            router={router}
                            path={path}
                            setPath={setPath}
                            breadcrumbIndex={breadcrumbIndex}
                            setBreadcrumbIndex={setBreadcrumbIndex}
                            breadcrumbHistory={breadcrumbHistory}
                            setBreadcrumbHistory={setBreadcrumbHistory}
                            setLevel={setLevel}
                            level={level}
                            sortOrder={sortOrder}
                            setSortOrder={setSortOrder}
                            sortField={sortField}
                            setSortField={setSortField}
                            setSummaryData={setSummaryData}
                            setShowSummaryModal={setShowSummaryModal}
                            setCurrentEditFile={setCurrentEditFile}
                            setPreviewData={setPreviewData}
                            setPreviewModalOpen={setPreviewModalOpen}
                            onDoubleClick={() => {
                                if (item.FileName || ["GENERAL_DOCUMENT", "file"].includes(item.TemplateCode)) {
                                    setCurrentFile(item);
                                } else {
                                    router.push({
                                        pathname: "/files",
                                        query: { currentDirectory: item.id || item.key || item.Id },
                                    })
                                    .then(() => {
                                        const folderPath = {
                                          href: item.id || item.key || item.Id,
                                          title: item.Name || item.title || "Untitled",
                                          icon: "folder",
                                        };
                                      
                                        const isSameAsLast = path[path.length - 1]?.href === folderPath.href;
                                      
                                        if (!isSameAsLast) {
                                          const newPath = [...path, folderPath];
                                          setPath(newPath);
                                          setBreadcrumbHistory(prev => [...prev.slice(0, breadcrumbIndex + 1), newPath]);
                                          setBreadcrumbIndex(prev => prev + 1);
                                          setLevel(level + 1);
                                        }
                                      });
                                      
                                }
                            }}
                            
                        />
                    )
                };
            });
         
            

            // Resolve all promises and maintain order
            const results = await Promise.all(promises);
            const orderedElements = results
                .sort((a, b) => a.index - b.index)
                .map(r => r.element);

            setStructure(orderedElements);
            setLoading(false);
        };

        processData();
    }, [data, scale, sortOrder]);

    useMemo(() => {
		if (currentFile) {
			setScale(2)
			// setCurrentFileData(null)
			//
			// dmsApi.get(`dmsapi/nts/query/GetNoteDetails?templateCode=${currentFile.TemplateCode}&userId=45bba746-3309-49b7-9c03-b5793369d73c&noteId=${currentFile["id"]
			// || currentFile["key"] || currentFile["Id"]}&dataAction=1`).then((res) => { console.log(res.data)
			// setCurrentFileData(res.data) })
			fileExplorerPanelRef.current?.setLayout([50, 50])
		}
	}, [currentFile]);
	useMemo(() => {
		console.log(currentDirectory || "/")
		
		setCurrentFolder(currentDirectory || "/")
		// setPath([...path, {href: currentDirectory, title: currentDirectory, icon: "folder"}])
		
	}, [currentDirectory]);
	useMemo(() => {
		console.log(currentFolder)
		if (!currentFolder) return;
		
		if (currentFolder === '/') {
			setLevel(0)
			setSource(`/dms/workspace/GetParentWorkspace?userId=${userId}&portalName=DMS`)
		} else {
			setSource(`/dms/query/GetChildFoldersAndDocuments?key=${currentFolder}&userId=${userId}&portalName=DMS`)
		}
	}, [currentFolder]);
	useMemo(() => {
		setLoading(true)
    
		if (typeof source === "string") {
			dmsApi.get(source).then((res) => {
				console.log(res.data)
				setData(res.data);
			}).catch((e) => {
				console.log(e);
				setLoading(false)
			});
		} else if (typeof source === "function") {
			if (source.toString().slice(0, 5) === "async") {
				source().then((res) => {
					setData(res);
				});
			} else {
				setData(source());
			}
		} else {
			setData(source);
			console.log(source)
		}
	}, [source]);
	
	return (
		<>
			
			<ResizablePanelGroup direction={"horizontal"}
			                     ref={fileExplorerPanelRef}>
				<ResizablePanel id={"explorer-panel"}
				                defaultSize={100}>
					<div className={"rounded overflow-clip"}>
						
						<div className={"min-h-[70vh] flex flex-col bg-secondary-50 bg-opacity-60 border-primary-200 border-b-0  dark:bg-secondary-900 dark:bg-opacity-20 border-2 dark:border-secondary-900 dark:shadow-xl"}>
							<div className={"flex gap-2 bg-primary-100 dark:bg-secondary-900 p-2 items-center justify-between"}>
                            <div className={"flex"}>
                            <Button
  icon={"arrow-left"}
  variant={"tertiary"}
  size={"sm"}
  disabled={breadcrumbIndex === 0}
  onClick={() => {
    if (breadcrumbIndex > 0) {
      setBreadcrumbIndex(prev => prev - 1);
    }
  }}
/>

<Button
  icon={"arrow-right"}
  variant={"tertiary"}
  size={"sm"}
  disabled={breadcrumbIndex >= breadcrumbHistory.length - 1}
  onClick={() => {
    if (breadcrumbIndex < breadcrumbHistory.length - 1) {
      setBreadcrumbIndex(prev => prev + 1);
    }
  }}
/>


<Button
  icon={"arrows-rotate"}
  variant={"tertiary"}
  size={"sm"}
  onClick={() => {
    setSource((prev) =>
      typeof prev === "string"
        ? prev.includes("?")
          ? `${prev}&_r=${Date.now()}`
          : `${prev}?_r=${Date.now()}`
        : prev // fallback if it's a function or object
    );
  }}
></Button>

								</div>

								<div className={"px-3 p-2 rounded dark:bg-secondary-800"}>
                                <Breadcrumb
                    path={path}
                    onClick={handlePathClick}
                    activeIndex={breadcrumbIndex}
                  />
								</div>
								{/*<Separator vertical={true}*/}
								{/*           className={"ml-auto"} />*/}
								{/*<div>*/}
								
								{/*</div>*/}
								<Separator vertical={true}
								           className={"ml-auto"} />
								<Dropdown source={["file", "folder", "workspace"].map(i => {
									return {
										id: i,
										name: toTitle(i),
										icon: iconMap[i]
									}
								})}
								          align={"end"}
								          onSelect={createNewItem}
								>
									<Button variant={"tertiary"}
									        icon={"plus"}></Button>
								</Dropdown>
							</div>
							{loading ? <div className={"p-4 flex flex-wrap gap-4"}>
								{Array.from({length: 10}).map(() => {
									return <Item skeleton={true}
									             scale={scale} />
								})}
							</div> : <div className={"flex flex-wrap gap-4 p-4 h-full justify-evenly"}>
								{structure ? structure.map((item, index) => {
									return <div key={index}
									            className={"flex-2 last:me-auto"}>
										{item}
									</div>;
								}) : "Empty"}
							</div>
								
							}
						</div>
					
					
					</div>
				</ResizablePanel>
				<ResizableHandle disabled={!currentFile}
				                 className={"bg-primary-200 dark:bg-secondary-900"} />
				<ResizablePanel id={"preview-panel"} defaultSize={0}>
                {currentEditFile ? (
                    <NtsEdit
                        source={{
                            NtsType: "Note",
                            Id: currentEditFile?.id || currentEditFile?.key || currentEditFile?.Id || null,
                            TemplateCode: currentEditFile?.TemplateCode || null
                        }}
                        onClose={() => {
                            setCurrentEditFile(null);
                            fileExplorerPanelRef.current?.setLayout([100, 0]);
                        }}
                        onSave={() => {
                            setCurrentEditFile(null);
                            refreshData(); // reload folder contents
                            fileExplorerPanelRef.current?.setLayout([100, 0]);
                        }}
                    />
                ) : (
                    <NtsPreview 
                        source={{
                            NtsType: "Note",
                            Id: currentFile?.id || currentFile?.key || currentFile?.Id || null,
                            TemplateCode: currentFile?.TemplateCode || null
                        }}
                        title={"NoteSubject"}
                        onClose={() => {
                            setCurrentFile(null);
                            fileExplorerPanelRef.current?.setLayout([100, 0]);
                        }}
                    />
                )}
            </ResizablePanel>
                       
			</ResizablePanelGroup>
			<div className={"flex gap-2 bg-primary-200 dark:bg-secondary-900 border-primary-200 dark:border-secondary-900 border-2 p-4 items-center justify-between"}>
				<Slider
					setValue={setScale}
					icons={{min: "folder", max: "folder"}}
					min={1}
					max={10}
					value={scale}
				/>
			</div>
            {showSummaryModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Document Summary</h2>
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Count</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{item.Name}</td>
                <td className="border px-2 py-1">{item.Count}</td>
              </tr>
            ))}
            <tr>
              <td className="border px-2 py-1 font-bold">TOTAL</td>
              <td className="border px-2 py-1 font-bold">
                {summaryData.reduce((acc, cur) => acc + cur.Count, 0)}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowSummaryModal(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
            <PreviewModal
                isOpen={previewModalOpen}
                onClose={() => {
                    setPreviewModalOpen(false);
                    if (previewData?.url) {
                        window.URL.revokeObjectURL(previewData.url);
                    }
                    setPreviewData(null);
                }}
                previewData={previewData}
            />
		</>
	)
		;
}

export default FileExplorer;