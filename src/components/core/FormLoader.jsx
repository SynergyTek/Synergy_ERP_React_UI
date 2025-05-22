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
import React, {forwardRef} from "react";
import {toast} from "sonner";
import {Textarea} from "~/ui/textarea";
import {RadioGroup, RadioGroupItem} from "~/ui/radio-group";
import {Checkbox} from "~/ui/checkbox";
import DatePicker from "~/ui/date-picker";
import {Select} from "~";

const generateSchema = (components) => {
    const schema = {};
    components?.forEach((component) => {
        const key = component.key;
        let fieldSchema;

        switch (component.type) {
            case "textfield":
                fieldSchema = z.string()
                    .min(component.validate?.minLength || 0, {
                        message: `${component.label} must be at least ${component.validate?.minLength} characters.`,
                    })
                    .max(component.validate?.maxLength || Infinity, {
                        message: `${component.label} must be at most ${component.validate?.maxLength} characters.`,
                    });
                break;

            case "email":
                fieldSchema = z.string().email({
                    message: "Invalid email address.",
                });
                break;

            case "number":
                fieldSchema = z.coerce.number()
                    .min(component.validate?.min || 0, {
                        message: `${component.label} must be at least ${component.validate?.min}.`,
                    })
                    .max(component.validate?.max || Infinity, {
                        message: `${component.label} must be at most ${component.validate?.max}.`,
                    });
                break;

            case "textarea":
                fieldSchema = z.string()
                    .min(component.validate?.minLength || 0, {
                        message: `${component.label} must be at least ${component.validate?.minLength} characters.`,
                    })
                    .max(component.validate?.maxLength || Infinity, {
                        message: `${component.label} must be at most ${component.validate?.maxLength} characters.`,
                    });
                break;

            case "radio":
                fieldSchema = z.string();
                break;
            case "checkbox":
                fieldSchema = z.boolean().refine((val) => val === true, {
                    message: `${component.label} is required`,
                });
                break;
            case "datetime":
                fieldSchema = z.date({
                    required_error: `${component.label} is required.`,
                });
                break;

            default:
                fieldSchema = z.any();
                break;
        }

        if (!component.validate || !component.validate.required) {
            fieldSchema = fieldSchema.optional();
        }

        schema[key] = fieldSchema;
    });
    return z.object(schema);
};


const renderComponent = (component) => {
    switch (component.type) {
        case "textfield":
        case "email":
        case "number":
            return (
                <FormField
                    key={component.key}
                    name={component.key}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{component.label}</FormLabel>
                            <FormControl>
                                <Input type={component.type==='number' ? 'number' : 'text'} placeholder={component.label} {...field} />
                            </FormControl>
                            <FormDescription>{component.description}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            );
        case "textarea":
            return (
                <FormField
                    key={component.key}
                    name={component.key}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{component.label}</FormLabel>
                            <FormControl>
                                <Textarea placeholder={component.label} {...field} />
                            </FormControl>
                            <FormDescription>{component.description}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            );
        case "radio":
            return (
                <FormField
                    key={component.key}
                    name={component.key}
                    render={({field}) => (
                        <FormItem className="space-y-3">
                            <FormLabel>{component.label}</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col mt-2"
                                >
                                    {component.values.map((value) => (
                                        <FormItem key={value.value} className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value={value.value} />
                                            </FormControl>
                                            <FormLabel className="font-normal ml-2">
                                                {value.label}
                                            </FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            );
        case "checkbox":
            return (
                <FormField
                    key={component.key}
                    name={component.key}
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
                                    {component.label}
                                </FormLabel>
                                <FormDescription>
                                    {component.description}
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
            )
        case "datetime":
            return (
                <FormField
                    key={component.key}
                    name={component.key}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>{component.label}</FormLabel>
                            <FormControl>
                                <DatePicker value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )

        default:
            return null;
    }
};

const FormLoader = forwardRef((
    {
        jsonSchema,
        ...props
    }, ref
) => {
    const formSchema = generateSchema(jsonSchema.components);
    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data) => {
        console.log(data);
        toast.success("Form data:",{description:JSON.stringify(data)});
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {jsonSchema.components?.map((component) => renderComponent(component))}
                <Button variant="primary" type="submit">Submit</Button>
            </form>
        </Form>
    );
});

export default FormLoader