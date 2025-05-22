import { InputField, Select, Notification } from "~";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "~/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/ui/form";
import { Input } from "~/ui/input";

// Validation schema using Zod
const formSchema = z.object({
    NAME: z.string({ message: "Name is required" }),
    USERID: z.string().optional(),
    EMAIL: z.string()
        .email("Invalid email address")
        .regex(/\b[A-Za-z0-9]+(?:[._%+-][A-Za-z0-9]+)*@[A-Za-z0-9]+(?:[-][A-Za-z0-9]+)*\.[A-Za-z]{2,}\b/, { message: "Invalid Email" }),
    Mobile: z.string().optional(),
    JobTitle: z.string().optional(),
    Address: z.string().optional(),
    DepartmentName: z.string().optional(),
    MobileDeviceToken: z.string().optional(),
    Status: z.string().optional(),
    LegalEntityIds: z.any().optional(),
    UserRole: z.any().optional(),
    Portal: z.any().optional(),
    LineManagerId: z.string().optional(),
    SponsorId: z.string().optional(),
    files_PhotoId: z.any().optional(),
    SignatureId: z.any().optional(),
    //UserGroupId: z.string().optional(),
});



const ManageUserForm = ({ id, name, inputData }) => {
    const router = useRouter();
    const [btnStatus, setBtnStatus] = useState(false);
    const [status, setStatus] = useState("Active");
    const [isSystemAdmin, setIsSystemAdmin] = useState(false);

    const StatusRef = useRef(null);
    const LegalEntityIdsRef = useRef(null);
    const UserRoleRef = useRef(null);
    const PortalRef = useRef(null);
    const LineManagerIdRef = useRef(null);
    const SponsorIdRef = useRef(null);
    const UserGroupIdRef = useRef(null);

    console.log(inputData, " inputdata")
    const defaultValues = {
        NAME: inputData?.Name,
        USERID: inputData?.UserId,
        EMAIL: inputData?.Email,
        Mobile: inputData?.Mobile,
        JobTitle: inputData?.JobTitle,
        Address: inputData?.Address,
        DepartmentName: inputData?.DepartmentName,
        MobileDeviceToken: inputData?.MobileDeviceToken,
        Status: inputData?.Status,
        LegalEntityIds: inputData?.LegalEntityIds,
        UserRole: inputData?.UserRole,
        Portal: inputData?.Portal,
        LineManagerId: inputData?.LineManagerId,
        SponsorId: inputData?.SponsorId,
        files_PhotoId: inputData?.files_PhotoId,
        SignatureId: inputData?.SignatureId,
        //UserGroupId: inputData?.UserGroupId,
    };

    // Initialize React Hook Form with Zod resolver
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    // Form submission handler
    const onSubmit = async (data) => {

        const formValues = {
            CREATEDBY: "45bba746-3309-49b7-9c03-b5793369d73c",
            COMPANYID: "5e44cd63-68f0-41f2-b708-0eb3bf9f4a72",
            LEGALENTITYID: "60d2df036755e8de168d8db7",
            PORTALID: "6ea64b17-6959-4cb8-a5d2-33728aebbbac",
            LEGALENTITYIDS: [
                "60d2df036755e8de168d8db7"
            ],
            Portal: [
                "6EA64B17-6959-4CB8-A5D2-33728AEBBBAC"
            ],
            isSystemAdmin: isSystemAdmin,
            Status: status,
            //UserGroupId:userGroupId,
            //SponsorId:sponsorId,
            //LineManagerId:lineManagerId,
            // Portal:portal,
            // UserRole:userRole,
            // LegalEntityIds:legalEntityIds

        };


        if (id) {
            formValues["Id"] = id;
            formValues["dataAction"] = 2;
        } else {
            formValues["dataAction"] = 1;
        }
        if (status !== "Active") {
            formValues["Status"] = "Inactive";
        }

        if (data.NAME) {
            defaultValues.NAME = data.NAME
        }
        if (data.EMAIL) {
            defaultValues.EMAIL = data.EMAIL
        }
        if (data.USERID) {
            defaultValues.USERID = data.USERID
        }
        if (data.Mobile) {
            defaultValues.Mobile = data.Mobile
        }
        if (data.JobTitle) {
            defaultValues.JobTitle = data.JobTitle
        }
        if (data.Address) {
            defaultValues.Address = data.Address
        }
        if (data.DepartmentName) {
            defaultValues.DepartmentName = data.DepartmentName
        }
        if (data.MobileDeviceToken) {
            defaultValues.MobileDeviceToken = data.MobileDeviceToken
        }
        if (data.Status) {
            defaultValues.Status = data.Status
        }
        if (data.LegalEntityIds) {
            defaultValues.LegalEntityIds = data.LegalEntityIds
        }
        if (data.UserRole) {
            defaultValues.UserRole = data.UserRole
        }
        if (data.Portal) {
            defaultValues.Portal = data.Portal
        }
        if (data.LineManagerId) {
            defaultValues.LineManagerId = data.LineManagerId
        }
        if (data.SponsorId) {
            defaultValues.SponsorId = data.SponsorId
        }
        if (data.files_PhotoId) {
            defaultValues.files_PhotoId = data.files_PhotoId
        }
        if (data.SignatureId) {
            defaultValues.SignatureId = data.SignatureId
        }

        const newData = { ...defaultValues, ...formValues }
        console.log(newData, " final data")
        // return false
        try {
            setBtnStatus(true);
            const response = await axios.post("/portalAdmin/User/NewManagePortalUser", newData);
            setBtnStatus(false);
            console.log(response, " manage user form")
            if (response.data?.success) {
                toast.success("Successful !", {
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">Your data is saved!</code>
                        </pre>
                    ),
                });
                router.push("/admin/user/")
            } else {
                toast.error("Warning !", {
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">Something went wrong!</code>
                        </pre>
                    ),
                });
                setBtnStatus(false);
                console.log("error manage user else")
            }
        } catch (error) {
            console.log(error, " manage user error")
            toast.error("Warning !", {
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">Something went wrong!</code>
                    </pre>
                ),
            });
            setBtnStatus(false);
            router.push("/admin/user/");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-3xl space-y-2">
             <div className="container mx-auto px-4">
                <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md p-6 mb-10">
                  <h2 className=" flex justify-center text-xl text-black font-medium mb-6">CREATE EMPLOYEE</h2>

                    <div className="flex flex-wrap justify-center -mx-2">
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField
                                name="NAME"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem> 
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField
                                name="USERID"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Display Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center -mx-2">
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField
                                name="EMAIL"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField
                                name="Mobile"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mobile</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Mobile" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center -mx-2">
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField
                                name="JobTitle"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Job Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField
                                name="Address"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center -mx-2">
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField
                                name="DepartmentName"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Department Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField
                                name="MobileDeviceToken"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mobile Device Token</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Mobile Device Token" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center -mx-2">
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField
                                name="Status"
                                control={form.control}
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <Select
                                                className="w-full"
                                                source="/cms/query/GetEnumIdNameList?enumType=StatusEnum"
                                                map={{ key: "Id", value: "Name" }}
                                                ref={StatusRef}
                                                onSelect={() =>
                                                    form.setValue(
                                                        "Status",
                                                        StatusRef.current?.getAttribute("value")
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField

                                name="LegalEntityIds"
                                control={form.control}
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Legal Entity IDs</FormLabel>
                                        <FormControl>
                                            <Select
                                                className="w-full"
                                                source="/cms/user/GetLegalEntitiesList"
                                                map={{ key: "Id", value: "Name" }}
                                                ref={LegalEntityIdsRef}
                                                onSelect={() =>
                                                    form.setValue(
                                                        "LegalEntityIds",
                                                        LegalEntityIdsRef.current?.getAttribute("value")
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField

                                name="UserRole"
                                control={form.control}
                                render={() => (
                                    <FormItem>
                                        <FormLabel>User Role</FormLabel>
                                        <FormControl>
                                            <Select
                                                className="w-full"
                                                source="/cms/query/GetUserRolesList"
                                                map={{ key: "Id", value: "Name" }}
                                                ref={UserRoleRef}
                                                onSelect={() =>
                                                    form.setValue(
                                                        "UserRole",
                                                        UserRoleRef.current?.getAttribute("value")
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField

                                name="Portal"
                                control={form.control}
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Portal</FormLabel>
                                        <FormControl>
                                            <Select
                                                className="w-full"
                                                source="/cms/query/GetPortalsList"
                                                map={{ key: "Id", value: "Name" }}
                                                ref={PortalRef}
                                                onSelect={() =>
                                                    form.setValue(
                                                        "Portal",
                                                        PortalRef.current?.getAttribute("value")
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField

                                name="LineManagerId"
                                control={form.control}
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Line Manager ID</FormLabel>
                                        <FormControl>
                                            <Select
                                                className="w-full"
                                                source="/cms/user/GetLineManagersList"
                                                map={{ key: "Id", value: "Name" }}
                                                ref={LineManagerIdRef}
                                                onSelect={() =>
                                                    form.setValue(
                                                        "LineManagerId",
                                                        LineManagerIdRef.current?.getAttribute("value")
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField

                                name="SponsorId"
                                control={form.control}
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Sponsor ID</FormLabel>
                                        <FormControl>
                                            <Select
                                                className="w-full"
                                                source="/cms/user/GetSponsorsList"
                                                map={{ key: "Id", value: "Name" }}
                                                ref={SponsorIdRef}
                                                onSelect={() =>
                                                    form.setValue(
                                                        "SponsorId",
                                                        SponsorIdRef.current?.getAttribute("value")
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center -mx-2">
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField

                                name="files_PhotoId"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Photo ID</FormLabel>
                                        <FormControl>
                                            <Input type="file" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full md:w-2/3 lg:w-1/2 px-2 mb-4">
                            <FormField

                                name="SignatureId"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Signature ID</FormLabel>
                                        <FormControl>
                                            <Input type="file" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex mt-3 gap-4 justify-start">
                        <Button
                            type="submit"
                            variant={"primary"}
                            disabled={btnStatus}
                        >
                            Submit
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={() => router.push("/admin/user/")}
                        >
                            Cancel
                        </Button>
                    </div>
              </div> 
            </div>
            </form>
        </Form>
    );
};


export default function ManageUser() {
    const router = useRouter();
    const { id = null, name = null } = router.query;
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        if (id) {
            axios
                .get(`/portalAdmin/User/NewEditUser?Id=${id}&portalId=6EA64B17-6959-4CB8-A5D2-33728AEBBBAC`)
                .then((res) => {
                    console.log(res.data)
                    setUserData(res.data);
                })
                .catch((e) => {
                    setUserData(null);
                    console.log(e);
                });
        }
    }, [])
    return (
        <div className="w-full flex flex-col items-center relative">
            <Head>
                <title>Manage User</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="text-white text-2xl mb-2 mt-6">Manage User</div>

            {
                userData?.Id ?
                    <ManageUserForm id={id} name={name} inputData={userData} />
                    :
                    <ManageUserForm id={id} name={name} inputData={null} />
            }
        </div>
    );
}
