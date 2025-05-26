'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const applicationSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  linkedIn: z.string().optional(),
  resume: z.any().refine((file) => file?.[0], 'Resume is required'),
  coverLetter: z.string().optional(),
  motivation: z.string().min(10, 'This field is required'),
  portfolio: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
});

export default function JobApplicationForm() {
  const form = useForm({
    resolver: zodResolver(applicationSchema),
    mode: 'onChange',
  });

  const onSubmit = (data) => {
    toast.success('🎉 Application received!');
    console.log(data);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-900 shadow-lg rounded-lg space-y-10 text-gray-900 dark:text-gray-100">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold dark:text-white">Software Engineer</h1>
        <p className="text-gray-500 dark:text-white">
          IT Department · Remote · Posted on May 20, 2025
        </p>
        <a href="/jobs" className="text-blue-600 text-sm hover:underline">
          ← Back to All Jobs
        </a>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

          <section>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">👤 Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel required>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      className="h-11 w-full bg-white dark:text-white border border-gray-300 dark:border-gray-600"
                      placeholder="Jane Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="h-11 w-full bg-white dark:text-white border border-gray-300 dark:border-gray-600"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel required>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      className="h-11 w-full bg-white dark:text-white border border-gray-300 dark:border-gray-600"
                      placeholder="+1 555 0123"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="linkedIn" render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      className="h-11 w-full bg-white dark:text-white border border-gray-300 dark:border-gray-600"
                      placeholder="https://linkedin.com/in/yourname"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </section>

          {/* Documents */}
          <section>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">📂 Resume </h3>

            <FormField name="resume" render={({ field }) => (
              <FormItem>
                <FormLabel required>Upload Resume</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.docx"
                    className="bg-white dark:text-white border border-gray-300 dark:border-gray-600"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                {field.value?.[0] && (
                  <p className="text-sm text-gray-600 dark:text-white mt-1">
                    Selected: {field.value[0].name}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="coverLetter" render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel>Cover Letter (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your cover letter here..."
                    className="bg-white dark:text-white border border-gray-300 dark:border-gray-600"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )} />
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">💬 Additional Information</h3>

            <FormField name="motivation" render={({ field }) => (
              <FormItem>
                <FormLabel required>Why do you want to work with us?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your motivation..."
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="portfolio" render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel>Portfolio / Website (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://yourportfolio.com"
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )} />
          </section>

          <FormField name="consent" render={({ field }) => (
            <FormItem className="flex items-center gap-2 mt-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel required className="mt-[px]">I agree to the terms and privacy policy</FormLabel>
              <FormMessage />
            </FormItem>
          )} />

          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            className="w-full h-12 mt-6"
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </Form>
    </div>
  );
}


// import * as React from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//     Form,
//     FormItem,
//     FormLabel,
//     FormControl,
//     FormDescription,
//     FormMessage,
//     FormField
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// // import { toast } from "react-toastify";

// const applicationSchema = z.object({
//     fullName: z.string().min(2, "Full Name is required"),
//     email: z.string().email("Invalid email address"),
//     phone: z.string().min(10, "Phone number is required"),
//     linkedIn: z.string().optional(),
//     resume: z.any().refine(file => file?.[0], "Resume is required"),
//     coverLetter: z.any().optional(),
//     motivation: z.string().min(10, "This field is required"),
//     portfolio: z.string().optional(),
//     consent: z.boolean().refine(val => val === true, "You must agree to the terms")
// });

// export default function JobApplicationForm() {
//     const form = useForm({
//         resolver: zodResolver(applicationSchema),
//         mode: "onChange"
//     });

//     const onSubmit = (data) => {
//         toast.success("Thank you! Your application has been received.");
//         console.log("Application data:", data);
//     };

//     return (
//         <div className="max-w-xl mx-auto space-y-8">
//             <div className="space-y-1">
//                 <h2 className="text-3xl font-semibold">Software Engineer</h2>
//                 <p className="text-muted-foreground">IT Department · Remote · Posted on May 20, 2025</p>
//                 <a href="/jobs" className="text-blue-600 text-sm">← Back to All Jobs</a>
//             </div>

//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//                     <div className="space-y-6">
//                         <h3 className="text-xl font-semibold">Personal Information</h3>

//                         <FormField name="fullName" render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel required>Full Name</FormLabel>
//                                 <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )} />

//                         <FormField name="email" render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Email Address</FormLabel>
//                                 <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )} />

//                         <FormField name="phone" render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Phone Number</FormLabel>
//                                 <FormControl><Input placeholder="+1 555 0123" {...field} /></FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )} />

//                         <FormField name="linkedIn" render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>LinkedIn Profile <span className="text-muted-foreground">(Optional)</span></FormLabel>
//                                 <FormControl><Input placeholder="https://linkedin.com/in/yourname" {...field} /></FormControl>
//                             </FormItem>
//                         )} />
//                     </div>

//                     <div className="space-y-6">
//                         <h3 className="text-xl font-semibold">Resume & Supporting Documents</h3>

//                         <FormField name="resume" render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Upload Resume</FormLabel>
//                                 <FormControl>
//                                     <Input type="file" accept=".pdf,.docx" onChange={e => field.onChange(e.target.files)} />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )} />

//                         {/* <FormField name="coverLetter" render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Cover Letter <span className="text-muted-foreground">(Optional)</span></FormLabel>
//                 <FormControl>
//                   <Input type="file" accept=".pdf,.docx" onChange={e => field.onChange(e.target.files)} />
//                 </FormControl>
//               </FormItem>
//             )} /> */}
//                         <FormField name="coverLetterText" render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Cover Letter (Text)</FormLabel>
//                                 <FormControl>
//                                     <Textarea placeholder="Write your cover letter here..." {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )} />
//                     </div>

//                     {/* 💬 Additional Info */}
//                     <div className="space-y-6">
//                         <h3 className="text-xl font-semibold">Additional Information</h3>

//                         <FormField name="motivation" render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Why do you want to work with us?</FormLabel>
//                                 <FormControl><Textarea placeholder="Share your thoughts..." {...field} /></FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )} />

//                         <FormField name="portfolio" render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Portfolio / Website <span className="text-muted-foreground">(Optional)</span></FormLabel>
//                                 <FormControl><Input placeholder="https://yourportfolio.com" {...field} /></FormControl>
//                             </FormItem>
//                         )} />
//                     </div>
//                     <FormField name="consent" render={({ field }) => (
//                         <FormItem className="flex items-start space-x-3">
//                             <FormControl>
//                                 <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                             </FormControl>
//                             <FormLabel>I agree to the terms and privacy policy</FormLabel>
//                             <FormMessage />
//                         </FormItem>
//                     )} />

//                     <Button type="submit" variant="primary" disabled={!form.formState.isValid}>
//                         Submit Application
//                     </Button>
//                 </form>
//             </Form>
//         </div>
//     );
// }
