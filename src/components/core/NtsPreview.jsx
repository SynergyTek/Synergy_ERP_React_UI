import {dmsApi} from "../../../client";
import {Icon, Separator, Text} from "~";
import {Button} from "~/ui/button";
import React, {forwardRef, useEffect, useState} from "react";
import axios from "axios";
import {Badge} from "~/ui/badge";
import {Popover, PopoverTrigger, PopoverContent} from "~/ui/popover";
import PropTypes from "prop-types";

const NtsPreview = forwardRef(({source, onClose, title, ...props}, ref) => {
    const {NtsType, Id, TemplateCode} = source
    const [data, setData] = useState(null)
    const [json, setJson] = useState(null)
    const [dataJson, setDataJson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        console.log("NtsPreview useEffect - Source:", source);
        if (!source) {
            console.log("NtsPreview useEffect - Source missing, returning");
            setLoading(false);
            return;
        }

        const { Id, TemplateCode } = source; // Destructure *after* checking if source exists

        if (!Id && !TemplateCode) {
            console.log("NtsPreview useEffect - Id/TemplateCode missing, returning");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
               // let url = `/dmsapi/nts/query/GetNoteDetails?userId=45bba746-3309-49b7-9c03-b5793369d73&noteId=${Id}${TemplateCode ? `&templateCode=${TemplateCode}` : ""}&dataAction=2`;
                const res = await dmsApi.get(`/nts/query/GetNoteDetails`, {
                    params: {
                      userId: "45bba746-3309-49b7-9c03-b5793369d73",
                      noteId: Id,
                      ...(TemplateCode && { templateCode: TemplateCode }),
                      dataAction: 2
                    }
                  });
                console.log("NtsPreview fetchData - Fetching URL:", res); // Log the final URL

               // const res = await axios.get(url);
                console.log("NtsPreview fetchData - Response:", res.data); // Log the response
                setData(res.data);
            } catch (err) {
                console.error("NtsPreview fetchData - Axios error:", err);
                setError("Preview not available.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [source]); //  Dependencies array updated and more specific

    useEffect(() => {
        if (!data) return
        if (data.Json) {
            try {
                let j_ = JSON.parse(data.Json);
                setJson(j_);
            } catch (error) {
                console.error("Error parsing Json:", error);
                setJson(null);
            }
        } else {
            setJson(null);
        }
        if (data.DataJson) {
            try {
                let dj_ = JSON.parse(data.DataJson);
                setDataJson(dj_);
            } catch (error) {
                console.error("Error parsing DataJson:", error);
                setDataJson(null);
            }
        } else {
            setDataJson(null);
        }
        setLoading(false)
    }, [data]);

    if (loading) {
        return (
            <div className={"p-4"}>
                <Text skeleton={true} className={"w-56 h-6 mb-2"} />
                <Text skeleton={true} className={"w-full h-4 mb-1"} />
                <Text skeleton={true} className={"w-48 h-4 mb-1"} />
                <Separator className={"my-2"} />
                <div className={"space-y-2"}>
                    <Text skeleton={true} className={"w-32 h-4"} />
                    <Text skeleton={true} className={"w-full h-8"} />
                    <Text skeleton={true} className={"w-64 h-4"} />
                    <Text skeleton={true} className={"w-full h-8"} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={"p-4 flex flex-col items-center justify-center"}>
                <Icon icon={"alert-triangle"} size={"2xl"} className={"text-warning-500 mb-2"} />
                <Text className={"font-semibold text-secondary-700 dark:text-secondary-300 mb-1"}>{error}</Text>
                <Text size={"sm"} className={"text-secondary-500 dark:text-secondary-400 mb-4"}>
                    An error occurred while loading the preview.
                </Text>
                <Button onClick={onClose} variant={"secondary"} size={"sm"}>
                    Close Preview
                </Button>
            </div>
        );
    }

    return (
        <div
            className={"min-h-[70vh] flex flex-col bg-secondary-50 bg-opacity-60 border-primary-200 border-b-0  dark:bg-secondary-900 dark:bg-opacity-20 border-2 dark:border-secondary-900 dark:shadow-xl"}>
            <div
                className={"@container flex gap-2 bg-primary-100 dark:bg-secondary-900 p-2 items-center justify-between"}>
                {dataJson ?
                    <>
                        <div className={"px-2"}>
                            <Text size={"xs"}>
                                {dataJson["NoteNo"]}
                            </Text>
                            <Text className={"font-bold"}>
                                {dataJson["TemplateDisplayName"]}
                            </Text>
                        </div>
                        <Separator vertical={true}
                                   className={"my-2"}/>
                        <div
                            className={"px-3 p-2 mx-auto  w-12 @md:w-full rounded bg-primary-50 dark:bg-secondary-800 shadow"}>
                            <Text size={"xs"}
                                  align={"center"}>
                                {(title ? dataJson[title] : dataJson["NoteNo"])}
                            </Text>
                        </div>
                        <Popover>
                            <PopoverTrigger>
                                <Button size={"sm"}
                                        variant={"tertiary"}
                                        icon={"clock"}/>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div>
                                    <Text size={"sm"}
                                          className={"font-bold mb-2"}>Created On</Text>
                                    <Text size={"xs"}
                                          variant={"span"}
                                          className={"font-bold"}>{new Date(dataJson["StartDate"]).toDateString()} </Text>
                                    <Text variant={"span"}
                                          size={"xs"}> {new Date(dataJson["StartDate"]).toLocaleTimeString()} </Text>
                                    <Separator/>
                                    <span className={"flex items-center gap-4"}>
										<Icon icon={"user-circle"}
                                              hover={false}/>
										<span>
											<Text size={"xs"}
                                                  className={"font-bold"}>{dataJson["CreatedByUser_Name"]}</Text>
									<Text size={"xs"}>{dataJson["CreatedByUser_Email"]}</Text>
										</span>
									</span>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <span className={"gap-1 items-center hidden @md:flex"}>
							<Text size={"xs"}
                                  color={"secondary"}>v{dataJson.VersionNo}</Text>
							<Badge size={"xs"}
                                   variant={"outline"}>{data.NoteStatusName}</Badge></span>
                        <Separator vertical={true}/>
                        <Button variant={"tertiary"}
                                icon={"close"}
                                onClick={() => {
                                    onClose && onClose()
                                }}
                        ></Button>
                    </>
                    : <></>
                }
            </div>
            <div className={"p-4"}>
                {data && json ? (
                    <div className={"h-[60vh] overflow-scroll"}>
                        {json.components?.map((comp, index) => (
                            <div key={index} className={"block mb-4"}>
                                <Text size={"xs"}
                                      wrap={true}
                                      className={"font-bold mt-4 mb-2 mx-2"}>{comp.label}</Text>
                                <Text
                                    wrap={true}
                                    className={"p-2 px-4 rounded bg-secondary-200/80 dark:bg-secondary-900 "}>{comp.udfValue ? comp.udfValue : "NA"}</Text>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading && !error && <Text>No data to display.</Text>
                )}
            </div>
        </div>
    )
})

NtsPreview.propTypes = {
    source: PropTypes.object,
    title: PropTypes.string,
    onClose: PropTypes.func,
}
export default NtsPreview