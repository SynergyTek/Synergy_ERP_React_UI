import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from "~/ui/button";
import { toast } from "sonner";

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = ({ url }) => {
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [pdfData, setPdfData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPDF = async () => {
            try {
                setLoading(true);
                const response = await fetch(url);
                const blob = await response.blob();
                setPdfData(blob);
            } catch (error) {
                console.error('Error loading PDF:', error);
                toast.error('Failed to load PDF');
            } finally {
                setLoading(false);
            }
        };

        loadPDF();
    }, [url]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        toast.success('PDF loaded successfully');
    };

    const onDocumentLoadError = (error) => {
        console.error('Error loading PDF:', error);
        toast.error('Failed to load PDF document');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-pulse">Loading PDF...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center h-full">
            <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        icon="chevron-left"
                    />
                    <span className="min-w-[100px] text-center">
                        Page {currentPage} of {numPages || '?'}
                    </span>
                    <Button
                        disabled={currentPage >= (numPages || 1)}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages || 1))}
                        icon="chevron-right"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setScale(prev => Math.max(prev - 0.2, 0.4))}
                        icon="minus"
                        disabled={scale <= 0.4}
                    />
                    <span className="min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
                    <Button
                        onClick={() => setScale(prev => Math.min(prev + 0.2, 2.0))}
                        icon="plus"
                        disabled={scale >= 2.0}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-auto w-full flex justify-center">
                {pdfData && (
                    <Document
                        file={pdfData}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        error={
                            <div className="flex flex-col items-center justify-center p-4">
                                <div className="text-red-500 mb-2">Failed to load PDF</div>
                                <Button
                                    variant="secondary"
                                    onClick={() => window.location.reload()}
                                >
                                    Try Again
                                </Button>
                            </div>
                        }
                        loading={
                            <div className="animate-pulse">Loading PDF...</div>
                        }
                    >
                        <Page
                            pageNumber={currentPage}
                            scale={scale}
                            loading={
                                <div className="animate-pulse">Loading page...</div>
                            }
                            error={
                                <div className="text-red-500">Failed to load page</div>
                            }
                        />
                    </Document>
                )}
            </div>
        </div>
    );
};

export default PDFViewer; 