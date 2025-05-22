import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { toast } from "sonner";

const ExcelViewer = ({ url }) => {
    const [excelData, setExcelData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadExcel = async () => {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                setExcelData(data);
            } catch (error) {
                console.error('Error loading Excel file:', error);
                toast.error('Failed to load Excel file');
            } finally {
                setLoading(false);
            }
        };

        loadExcel();
    }, [url]);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading Excel file...</div>;
    }

    if (!excelData) {
        return <div className="flex items-center justify-center h-full">Failed to load Excel file</div>;
    }

    return (
        <div className="w-full h-full overflow-auto bg-white p-4">
            <table className="min-w-full border-collapse">
                <tbody>
                    {excelData.map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-100 font-bold' : ''}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="border px-4 py-2">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExcelViewer; 