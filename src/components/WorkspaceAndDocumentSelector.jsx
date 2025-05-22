import React, { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { dmsApi } from '@/../client';

const USER_ID = '45bba746-3309-49b7-9c03-b5793369d73c';
const PORTAL = 'DMS';

export default function WorkspaceAndDocumentSelector({ 
  resetButtonRef,
  selectedFolder: propSelectedFolder,
  setSelectedFolder: propSetSelectedFolder,
  breadcrumb: propBreadcrumb,
  setBreadcrumb: propSetBreadcrumb 
}) {
  const {
    setValue,
    setError,
    clearErrors,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const [currentNodes, setCurrentNodes] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [docError, setDocError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingNode, setLoadingNode] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Sync with props if provided
  useEffect(() => {
    if (propBreadcrumb) {
      setBreadcrumb(propBreadcrumb);
    }
  }, [propBreadcrumb]);

  useEffect(() => {
    if (propSelectedFolder) {
      setSelectedFolder(propSelectedFolder);
    }
  }, [propSelectedFolder]);

  useEffect(() => {
    fetchRootWorkspaces();
  }, []);

  const fetchRootWorkspaces = async () => {
    try {
      setIsLoading(true);
      if (!initialLoad) {
        setCurrentNodes([]);
      }
      const res = await dmsApi.get(
        `/dms/workspace/GetParentWorkspace?userId=${USER_ID}&portalName=${PORTAL}`
      );
      const nodes = Array.isArray(res.data)
        ? res.data.map((item) => ({ ...item, Workspace: true }))
        : [];
      setCurrentNodes(nodes);
      setInitialLoad(false);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      setInitialLoad(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentWorkspaceId = breadcrumb.length > 0 ? breadcrumb[0].id : null;
    if (!currentWorkspaceId) {
      setDocumentTypes([]);
      return;
    }

    const fetchDocumentTypes = async () => {
      try {
        setIsLoading(true);
        const res = await dmsApi.get(
          `/dms/query/ReadTemplateByWorkspace?workspaceId=${currentWorkspaceId}`
        );
        setDocumentTypes(res.data || []);
        setDocError('');
      } catch (error) {
        console.error('Error fetching document types:', error);
        setDocumentTypes([]);
        setDocError('Failed to load document types.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentTypes();
  }, [breadcrumb]);

  const fetchChildren = async (workspaceId) => {
    try {
      setIsLoading(true);
      const res = await dmsApi.get(
        `/dms/query/GetChildFoldersAndDocuments?key=${workspaceId}&userId=${USER_ID}&portalName=${PORTAL}`
      );
      const folders = Array.isArray(res.data)
        ? res.data.filter((item) => item.Workspace || item.folder)
        : [];
      return folders.map((item) => ({
        ...item,
        id: item.key,
        Name: item.title,
        hasChildren: true,
      }));
    } catch (error) {
      console.error('Error fetching children:', error);
      return [];
    } finally {
      setIsLoading(false);
      setLoadingNode(null);
    }
  };

  const handleNodeClick = async (node) => {
    if (isLoading || loadingNode) return;
    
    const alreadySelected = selectedFolder?.id === node.id;

    if (alreadySelected) {
      setSelectedFolder(null);
      if (propSetSelectedFolder) propSetSelectedFolder(null);
      const newBreadcrumb = breadcrumb.slice(0, -1);
      setBreadcrumb(newBreadcrumb);
      if (propSetBreadcrumb) propSetBreadcrumb(newBreadcrumb);
      setValue('selectedFolder', null);
      setValue('breadcrumb', newBreadcrumb);
      return;
    }
    
    if (breadcrumb.find(item => item.id === node.id)) {
      return;
    }
    
    setLoadingNode(node.id);
    const newBreadcrumb = [...breadcrumb, node];
    setBreadcrumb(newBreadcrumb);
    if (propSetBreadcrumb) propSetBreadcrumb(newBreadcrumb);
    setValue('breadcrumb', newBreadcrumb);

    const children = node.hasChildren ? await fetchChildren(node.id) : [];
    setCurrentNodes(children);
    setSelectedFolder(node);
    if (propSetSelectedFolder) propSetSelectedFolder(node);
    setValue('selectedFolder', node);
    clearErrors('folderSelection');
  };

  const handleBreadcrumbClick = async (index) => {
    if (isLoading || loadingNode) return;
    
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    const selectedNode = newBreadcrumb.at(-1);

    setLoadingNode(selectedNode.id);
    setBreadcrumb(newBreadcrumb);
    if (propSetBreadcrumb) propSetBreadcrumb(newBreadcrumb);
    setValue('breadcrumb', newBreadcrumb);
    setSelectedFolder(selectedNode);
    if (propSetSelectedFolder) propSetSelectedFolder(selectedNode);
    setValue('selectedFolder', selectedNode);

    const children = selectedNode?.hasChildren
      ? await fetchChildren(selectedNode.id)
      : [];

    setCurrentNodes(children);
    clearErrors('folderSelection');
  };

  const handleReset = async () => {
    setBreadcrumb([]);
    setSelectedFolder(null);
    if (propSetBreadcrumb) propSetBreadcrumb([]);
    if (propSetSelectedFolder) propSetSelectedFolder(null);
    setValue('breadcrumb', []);
    setValue('selectedFolder', null);
    await fetchRootWorkspaces();
  };

  const WorkspaceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
      <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
    </svg>
  );

  const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  );

  const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
    </svg>
  );

  return (
    <div className="border p-4 rounded bg-white dark:bg-secondary-800 shadow-sm">
      <div className="flex items-center justify-between font-medium mb-3">
        <span className="text-lg text-gray-800 dark:text-gray-200">{selectedFolder ? selectedFolder.Name : 'Select Folder'}</span>
        {selectedFolder && !isLoading && !loadingNode && (
          <button
            type="button"
            ref={resetButtonRef}
            onClick={handleReset}
            className="text-red-500 hover:text-red-700 ml-2 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Reset selection"
            disabled={isLoading || loadingNode}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {breadcrumb.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 mb-3 rounded border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-1 text-sm flex-wrap">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={item.id}>
                <span
                  className={`${
                    isLoading || loadingNode ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                  } px-2 py-1 rounded transition-colors ${
                    index === breadcrumb.length - 1
                      ? 'font-semibold bg-white dark:bg-secondary-700 shadow-sm'
                      : 'hover:bg-white dark:hover:bg-secondary-700'
                  }`}
                  onClick={() => !isLoading && !loadingNode && handleBreadcrumbClick(index)}
                >
                  {item.Workspace ? (
                    <span className="text-blue-600 dark:text-blue-400">
                      <WorkspaceIcon /> {item.Name}
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400">
                      <FolderIcon /> {item.Name}
                    </span>
                  )}
                  {loadingNode === item.id && (
                    <span className="ml-2 inline-block">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 inline-block"></div>
                    </span>
                  )}
                </span>
                {index < breadcrumb.length - 1 && (
                  <span className="text-gray-400 dark:text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-secondary-900/70 flex justify-center items-center z-10 rounded">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        <ul
          className={`${
            currentNodes.length > 5 ? 'max-h-52 overflow-y-auto' : ''
          } space-y-1 border rounded p-2 bg-gray-50 dark:bg-secondary-900 min-h-[100px]`}
        >
          {currentNodes.map((node) => (
            <li
              key={node.id}
              className={`${
                isLoading || loadingNode ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              } px-3 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-secondary-700 ${
                selectedFolder?.id === node.id
                  ? 'bg-white dark:bg-secondary-600 shadow-sm font-medium'
                  : ''
              } ${node.Workspace ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}
              onClick={() => !isLoading && !loadingNode && handleNodeClick(node)}
            >
              {node.Workspace ? <WorkspaceIcon /> : <FolderIcon />}
              {node.Name}
              {loadingNode === node.id && (
                <span className="ml-2 inline-block">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 inline-block"></div>
                </span>
              )}
            </li>
          ))}
          {!isLoading && currentNodes.length === 0 && (
            <li className="px-3 py-2 text-gray-500 italic text-center">No folders found</li>
          )}
        </ul>
      </div>

      {(!selectedFolder || errors.folderSelection) && (
        <p className="text-red-600 text-sm mt-2">
          {errors.folderSelection?.message || 'Please select a folder to upload files.'}
        </p>
      )}

      <div className="mt-4 bg-gray-50 dark:bg-secondary-900 rounded border">
        <Controller
          name="documentType"
          control={control}
          render={({ field, fieldState }) => (
            <div className="p-3">
              <label className="flex items-center mb-2 font-medium text-gray-700 dark:text-gray-300">
                <DocumentIcon />
                Document Type
              </label>
              
              <div className="relative">
                {isLoading && documentTypes.length === 0 && (
                  <div className="absolute inset-0 bg-white/70 dark:bg-secondary-900/70 flex justify-center items-center z-10 rounded">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
                
                <div className="relative">
                  <select
                    {...field}
                    className="w-full border rounded p-2 bg-white dark:bg-secondary-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow appearance-none pr-8"
                    disabled={isLoading || loadingNode}
                  >
                    <option value="">Select Document Type</option>
                    {documentTypes.map((doc) => (
                      <option key={doc.Id} value={doc.Id}>
                        {doc.DisplayName || doc.Name || doc.TemplateCategoryName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                
                {docError && !fieldState.error && (
                  <p className="text-red-600 text-sm mt-1">{docError}</p>
                )}
                {fieldState.error && (
                  <p className="text-red-600 text-sm mt-1">{fieldState.error.message}</p>
                )}
                
                {!isLoading && documentTypes.length === 0 && !docError && (
                  <p className="text-gray-500 text-sm mt-1 italic">No document types available for this workspace.</p>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
