// import { InputField, Select, Button as btn, Notification } from "~";
import { useState, useEffect } from "react";
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


const ChangePasswordForm = ({ id, name }) => {
    const router = useRouter();
    const [btnStatus, setBtnStatus] = useState(false);
    const passwordSchema = z
        .string()
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]:;\"'<>,.?/\\|`~]).{8,}$/, {
            message:
                "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
        });

    // Define the form validation schema with Zod
    const formSchema = z
        .object({
            currentPassword: !name ? passwordSchema : passwordSchema.optional(),
            newPassword: passwordSchema,
            confirmPassword: passwordSchema,
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"], // Target field for the error message
        });

    // Initialize React Hook Form with Zod resolver
    const form = useForm({
        resolver: zodResolver(formSchema),

    });

    // Form submission handler
    const onSubmit = async (data) => {
        const formValues = {
            userId: id,
            currentPassword: name,
            ...data
        };
        console.log(formValues, "data change pass");

        try {
            setBtnStatus(true);
            const response = await axios.post("/dmsapi/portalAdmin/User/ChangePasswordPage", formValues);
            setBtnStatus(false);

            if (response.data?.success) {
                toast.success("Successful !", {
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">Your password has been changed!</code>
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
            }
        } catch (error) {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-4/5 max-w-lg flex flex-col space-y-2">
                {!name && (
                    <FormField
                        name="currentPassword"
                        control={form.control} // Provide control to form field
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Current password" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    name="newPassword"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter New password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Confirm Password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex mt-3 gap-4 justify-start">
                    <Button type="submit" variant={"primary"} disabled={btnStatus} >
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
            </form>
        </Form>
    );
};

export default function ChangePassword() {
    const router = useRouter();
    const { id = null, name = null } = router.query;

    return (
        <div className="w-full flex flex-col items-center">
            <Head>
                <title>Change Password</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="text-white text-2xl mb-2 mt-6">Change Password</div>

            <ChangePasswordForm id={id} name={name} />
        </div>

    );
}
