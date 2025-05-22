import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { dmsApi } from '../../../client'
import { Separator, Text } from '~'
import { Button } from '~/ui/button'
import { Input } from '~/ui/input'
import { toast } from 'sonner'

function NtsEdit({ source, onClose, onSave }) {
    const { NtsType, Id, TemplateCode } = source || {}
    const [data, setData] = useState(null)
    const [json, setJson] = useState(null)
    const [loading, setLoading] = useState(true)
    const portalName = 'DMS'

    useEffect(() => {
        if (!Id || !TemplateCode) return

        setLoading(true)
        dmsApi
            .get(`/nts/query/GetNoteDetails`, {
                params: {
                    userId: '45bba746-3309-49b7-9c03-b5793369d73c',
                    noteId: Id,
                    templateCode: TemplateCode,
                    dataAction: 2,
                },
            })
            .then((res) => {
                setData(res.data)
                try {
                    const parsed = JSON.parse(res.data.Json || '{}')
                    setJson(parsed)
                } catch (err) {
                    console.error('Failed to parse Json', err)
                    toast.error('Failed to load document data.')
                }
            })
            .catch((err) => {
                console.error('Fetch error', err)
                toast.error('Failed to fetch note details.')
            })
            .finally(() => setLoading(false))
    }, [Id, TemplateCode])

    const handleChange = (index, value) => {
        const updated = { ...json }
        updated.components[index].udfValue = value
        setJson(updated)
    }

    const handleSave = () => {
        if (!json) return toast.error('No data to save.')

        dmsApi
            .post(`/nts/command/ManageNote`, {
                OwnerUserId: '45bba746-3309-49b7-9c03-b5793369d73c',
                NoteId: Id,
                PortalName: portalName,
                TemplateCode: TemplateCode,
                Json: JSON.stringify(json),
                TemplateId: data.TemplateId,
                RecordId: Id,
                DataAction: 2,
            })
            .then(() => {
                toast.success('Document saved successfully.')
                if (onSave) onSave()
            })
            .catch((err) => {
                console.error('Save error', err)
                toast.error('Failed to save document.')
            })
    }

    if (loading) return <Text skeleton className="h-6 w-48 p-4" />

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <Text className="text-lg font-bold">Edit Document</Text>
                <Button icon="x" variant="ghost" onClick={onClose} />
            </div>
            <Separator />
            <div className="mx-auto w-full max-w-4xl">
                <div className="space-y-4">
                    {json?.components?.map((comp, index) => (
                        <div key={index} className="space-y-2">
                            <Text className="text-sm font-medium text-gray-700">
                                {comp.label}
                            </Text>
                            <Input
                                value={comp.udfValue || ""}
                                onChange={(e) => handleChange(index, e.target.value)}
                                className="w-full"
                                placeholder={`Enter ${comp.label.toLowerCase()}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button icon="save" onClick={handleSave}>
                    Save
                </Button>
            </div>
        </div>
    )
}

NtsEdit.propTypes = {
    source: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}

export default NtsEdit