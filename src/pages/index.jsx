'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Text from '~/core/text';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/ui/card";
import { Button } from "~/ui/button";
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  ChevronRight,
  DownloadCloud,
  Plus,
  Briefcase,
} from 'lucide-react';
import { useSidebar } from "@/layouts/SidebarContext";

// Dummy Data
const attendanceData = [
  { name: 'Office', value: 198, color: '#2563eb' },
  { name: 'Work From Home', value: 42, color: '#60a5fa' },
  { name: 'Leave', value: 25, color: '#93c5fd' },
];

const payslipChartData = [
  { name: 'Paid', value: 31, color: '#2563eb' },
  { name: 'Unpaid', value: 0, color: '#93c5fd' },
];

const upcomingHolidays = [
  { date: "18 Apr", day: "Friday", name: "Good Friday", link: "#" },
  { date: "1 May", day: "Thursday", name: "May Day", link: "#" },
  { date: "27 June", day: "Monday", name: "Rathayatra", link: "#" },
  { date: "15 August", day: "Friday", name: "Independence Day", link: "#" },
];

const eventsAndMeetings = [
  { icon: Briefcase, title: "Marketing Meeting", subtitle: "Meeting", time: "8:00 am", date: "15/04/2025" },
  { icon: Briefcase, title: "Development Meeting", subtitle: "Job Interview", time: "11:00 am", date: "23/04/2025" },
  { icon: Briefcase, title: "Safety", subtitle: "Consulting", time: "11:30 am", date: "25/04/2025" },
  { icon: Briefcase, title: "Meeting with Team", subtitle: "Meeting", time: "2:30 pm", date: "26/04/2025" },
];

const quickAccessLinks = [
  { name: "Reimbursement Payslip", href: "#" },
  { name: "IT Statement", href: "#" },
  { name: "YTD Reports", href: "#" },
];

// Add getGreeting function
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
};

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [weeks, setWeeks] = useState(['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']);
  const [greeting, setGreeting] = useState(getGreeting());
  const { setSidebar } = useSidebar();

  useEffect(() => {
    setSidebar(true);
  }, [setSidebar]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
      setGreeting(getGreeting());
    };
    updateDateTime();
    const timerId = setInterval(updateDateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="min-h-screen px-4 md:px-8 md:py-10 space-y-8">
      {/* Top Banner */}
      <Card className="overflow-hidden rounded-2xl shadow-sm">
        <div className="relative h-40">
          <Image
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80"
            alt="Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/80 via-blue-600/60 to-transparent p-6 text-white flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-white">{greeting}</h2>
            <p className="text-sm text-white/90">"An employee's experience is the sum of all interactions they have with the organization."</p>
            <p className="text-xs italic mt-1 text-white/80">- MATT MULLENWEG</p>
          </div>
        </div>
      </Card>

      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time + Sign In */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm text-gray-500">{currentDate}</CardDescription>
            <CardTitle className="text-4xl font-bold text-blue-600">{currentTime}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">{weeks[new Date().getDay()]} | 10AM - 7PM</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Sign In</Button>
          </CardFooter>
        </Card>

        {/* Attendance */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Today Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className=" mt-4 space-y-2">
                {attendanceData.map((item) => (
                  <div key={item.name} className="flex justify-between gap-5 text-sm px-2">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
                  <p className="text-xs text-gray-500 mt-3">265 Employees</p>
              </div>
            
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickAccessLinks.map((item) => (
              <Link key={item.name} href={item.href} className="flex justify-between items-center p-2 -mx-2 rounded-md hover:bg-gray-100 hover:dark:bg-gray-800">
                <Text className="text-sm text-gray-700">{item.name}</Text>
                <ChevronRight className="h-4 w-4 text-blue-600" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payslip */}
        <Card className="rounded-2xl flex-rowshadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Payslip</CardTitle>
         
          </CardHeader>


          <CardContent >
            <div className="flex items-center gap-4 justify-between">
                <div>
                <CardDescription className="text-xs text-gray-500">Mar 1 - Mar 31, 2025</CardDescription>
                <p className="text-s text-blue-600 font-semibold mt-1">31 Paid Days</p>

                </div>
          

            <div className="w-[70px] ">
              <ResponsiveContainer width="100%" height={100}>
                <PieChart>
                  <Pie
                    data={payslipChartData}
                    innerRadius={25}
                    outerRadius={35}
                    dataKey="value"
                  >
                    {payslipChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
             
            </div>
            </div>
          
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <Text>Gross Pay</Text>
                <Text className="font-mono">₹ ****</Text>
              </div>
              <div className="flex justify-between text-gray-600">
                <Text>Deduction</Text>
                <Text className="font-mono">₹ ****</Text>
              </div>
              <div className="flex justify-between font-semibold text-gray-800">
                <Text>Net Pay</Text>
                <Text className="font-mono">₹ ****</Text>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between flex-row items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs border-blue-600 text-blue-600 hover:bg-blue-50">
              <DownloadCloud className="mr-1.5 h-3 w-3" /> Download PDF
            </Button>
            <Button variant="link" size="sm" className="text-xs text-blue-600">Show Salary</Button>
          </CardFooter>
        </Card>

        {/* Upcoming Holidays */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Upcoming Holidays</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingHolidays.map((holiday) => (
              <div key={holiday.name} className="flex justify-between items-center p-2 -mx-2 hover:bg-gray-100 hover:dark:bg-gray-800 rounded-md">
                <div>
                  <Text className="text-xs text-gray-500">{holiday.date}</Text>
                  <Text className="text-sm font-medium text-gray-700">{holiday.day}</Text>
                </div>
                <Link href={holiday.link} className="text-sm text-blue-600 font-medium hover:underline">
                  {holiday.name}
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Events and Meetings */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex justify-between flex-row items-center gap-2">
            <CardTitle className="text-base font-semibold">Events and Meetings</CardTitle>
            <Button size="sm" className="h-8 px-3 text-xs bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {eventsAndMeetings.map((event, index) => (
              <div key={index} className="flex gap-3 items-start p-2 -mx-2 hover:bg-gray-100 hover:dark:bg-gray-800 rounded-md">
                <div className="bg-blue-50 p-1.5 rounded-md mt-1">
                  <event.icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-grow">
                  <Text className="text-sm font-semibold text-gray-800">{event.title}</Text>
                  <Text className="text-xs text-gray-500">{event.subtitle}</Text>
                </div>
                <div className="text-right">
                  <Text className="text-sm font-medium text-gray-800">{event.time}</Text>
                  <Text className="text-xs text-gray-500">{event.date}</Text>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
