import React, {useRef} from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/ui/form";
import { Input } from "~/ui/input";
import { toast } from "sonner"
import {Textarea} from "~/ui/textarea";
import {RadioGroup, RadioGroupItem} from "~/ui/radio-group";
import {Checkbox} from "~/ui/checkbox";
import DatePicker from "~/ui/date-picker";
import {Select} from "~";

export default {
    title: 'Form/Form',
    component: Form,
};

export const ProfileFormStory = () => {
    const selectRef = useRef();
    const formSchema = z.object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(20, {
            message: "Username must be at most 20 characters."
        })
        .regex(/^[a-zA-Z0-9_]*$/, {
            message: "Username must not contain spaces and special characters.",
        }),
        message: z.string().optional(),
        gender: z.enum(["male", "female"], {
            required_error: "You need to select gender.",
        }),
        appointmentDate: z.date({
            required_error: "Appointment date is required.",
        }),
        terms: z.boolean().refine((val) => val === true, {
            message: "You must accept the terms and conditions",
        }),
        select: z.string(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data) => {
        toast.info("You submitted the following values:", {
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    };

    return <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="argojun" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter you message here..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="select"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select</FormLabel>
                            <FormControl>
                                <Select
                                    defaultValue={field.value}
                                    onSelect={(selected) => field.onChange(selected?.name)}
                                    source="https://jsonplaceholder.typicode.com/users"
                                    map={{key: "id", value: "name"}}
                                    className={'w-full'}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gender"
                    render={({field}) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col mt-2"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="male" />
                                        </FormControl>
                                        <FormLabel className="font-normal ml-2">
                                            Male
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="female" />
                                        </FormControl>
                                        <FormLabel className="font-normal ml-2">
                                            Female
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Appointment Date</FormLabel>
                            <FormControl>
                                <DatePicker value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="terms"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 gap-2">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Accept terms and conditions
                                </FormLabel>
                                <FormDescription>
                                    You agree to our Terms of Service and Privacy Policy.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
                <Button variant={'primary'} type="submit">Submit</Button>
            </form>
        </Form>;
}
