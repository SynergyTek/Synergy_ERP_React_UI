import React, { useEffect, useRef } from 'react';
import { renderAsync } from 'docx-preview';
import { toast } from "sonner";

const DocxViewer = ({ url }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const loadDoc = async () => {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                if (containerRef.current) {
                    await renderAsync(blob, containerRef.current);
                }
            } catch (error) {
                console.error('Error loading Word file:', error);
                toast.error('Failed to load Word file');
            }
        };

        loadDoc();
    }, [url]);

    return (
        <div ref={containerRef} className="w-full h-full overflow-auto bg-white p-4" />
    );
};

export default DocxViewer; 