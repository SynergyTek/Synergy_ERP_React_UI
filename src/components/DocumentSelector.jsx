import React, { useEffect, useState } from 'react';
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { dmsApi } from "@/../client";

const PORTAL_ID = '6ea64b17-6959-4cb8-a5d2-33728aebbbac';

export default function DocumentSelector({ control, docError }) {
    const [documentTypes, setDocumentTypes] = useState([]);

    useEffect(() => {
        const fetchDocumentTypes = async () => {
            try {
                const response = await dmsApi.get(
                    `/dms/query/DmsGetDocumentTemplateIdNameListByUser?PortalId=${PORTAL_ID}`
                );
                setDocumentTypes(response.data || []);
            } catch (error) {
                console.error('Error fetching document types:', error);
            }
        };

        fetchDocumentTypes();
    }, []);

    return (
        <FormField
            name="documentType"
            control={control}
            rules={{ required: 'Document type is required' }}
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <FormControl>
                        <select {...field} className="w-full border rounded p-2 dark:bg-secondary-800">
                            <option value="">Select Document Type</option>
                            {documentTypes.map((doc) => (
                                <option key={doc.Id} value={doc.Id}>
                                    {doc.DisplayName || doc.Name || doc.TemplateCategoryName}
                                </option>
                            ))}
                        </select>
                    </FormControl>
                    {docError && (
                        <p className="text-red-600 text-sm">{docError}</p>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
} 