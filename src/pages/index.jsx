import {Card, CardContent, CardHeader, CardTitle} from "~/ui/card"
import { Badge } from "~/ui/badge"
import { useSidebar } from "@/layouts/SidebarContext";
import { Progress } from "~/ui/progress"
import { Button } from "~/ui/button"
import { FileIcon, FolderIcon, ClockIcon, StarIcon, UploadIcon, ShareIcon, TrashIcon } from "lucide-react"
import {
    Pie,
    PieChart,
} from "recharts"
import {ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent} from "~/ui/chart";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {format} from "date-fns";
import Head from "next/head";
import {dmsApi} from "@/../client";


export default function Component() {
    const [data, setData] = useState();
    const { setSidebar } = useSidebar();
    useEffect(() => {
      setSidebar(true);
  }, [setSidebar]);
  
    const recentDocuments = [];
    const chartData = []
    for (var i=0; i< data?.FilesList.length; i++) {
        recentDocuments.push({ name: data?.FilesList[i].FileName, accessed: data?.FilesList[i].CreatedDateDisplay })
    }

    const recentActivities = [
        { user: 'John Doe', action: 'uploaded', document: 'Q2 Report.pdf', time: '2 minutes ago' },
        { user: 'Jane Smith', action: 'edited', document: 'Project Proposal.docx', time: '15 minutes ago' },
        { user: 'Mike Johnson', action: 'deleted', document: 'Old Invoice.xlsx', time: '1 hour ago' },
        { user: 'Sarah Williams', action: 'shared', document: 'Team Photo.jpg', time: '3 hours ago' },
    ]

    const favoriteFolders = [
        { name: 'Projects', count: 23 },
        { name: 'Client Files', count: 45 },
        { name: 'Personal', count: 12 },
        { name: 'Archive', count: 78 },
    ]
    const chartConfig = {
        count: {
            label: "FilesCount",
        },
    }
    const totalExtensions = data?.Top5Extensions.length + 1;
    for (var i=1; i<totalExtensions; i++) {
        chartData.push({ files: `${i}`, count: data?.Top5Extensions[i-1].Count, fill: `var(--color-${i})` });
        chartConfig[i] = {
            label: data?.Top5Extensions[i-1].Extension.toUpperCase(),
            color: `hsl(var(--chart-${i}))`,
        }
    }
    chartData.push({files: `${totalExtensions}`, count: data?.Others, fill: `var(--color-${totalExtensions}`})
    chartConfig[totalExtensions] = {
        label: "Others",
        color: `hsl(var(--chart-${totalExtensions}))`,
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dmsApi.get('/dms/query/GetUserDocuments?userId=45bba746-3309-49b7-9c03-b5793369d73c');
                setData(response.data);
                console.log(response.data)
            } catch (error) {
                console.log('Failed to fetch data');
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen p-3 md:p-8 space-y-8">
            <Head>
                <title>Document Management System</title>
                <link rel={'icon'} href={'/public/favicon.ico'}/>
            </Head>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Your Documents</CardTitle>
                        <FileIcon className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.filesCount}</div>
                        <p className="text-xs text-green-500">+5 new this week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                        <FileIcon className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.StorageUsed}</div>
                        <p className="text-xs text-blue-500">70% of your quota</p>
                        <Progress value={70} className="mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Shared with You</CardTitle>
                        <ShareIcon className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">27</div>
                        <p className="text-xs text-blue-500">3 new shares</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                        <ClockIcon className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-red-500">Next: Q3 Report (3 days)</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Document Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square w-full max-h-[300px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                        >
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie data={chartData} dataKey="count" className={'bg-blue-700'} innerRadius={60} labelLine={false} label nameKey="files" />
                                <ChartLegend
                                    content={<ChartLegendContent nameKey="files" />}
                                    className="flex-wrap gap-4 [&>*]:justify-center"
                                />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {recentDocuments.map((doc, index) => (
                                <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-secondary-800 hover:cursor-pointer transition-colors duration-200">
                                    <div className="flex items-center">
                                        <FileIcon className="h-4 w-4 mr-2 text-blue-500" />
                                        <span className="text-sm font-medium">{doc.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{doc.accessed}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <li key={index} className="flex items-center">
                                    <div className="mr-4">
                                        <Badge variant="outline" size={'xs'}>{activity.action}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-500 dark:text-secondary-300">{activity.user} {activity.action} {activity.document}</p>
                                        <p className="text-xs text-muted-foreground dark:text-secondary-500">{activity.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Favorite Folders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {favoriteFolders.map((folder, index) => (
                                <li key={index} className="flex items-center justify-between p-1 rounded-md hover:bg-gray-100 dark:hover:bg-secondary-800 hover:cursor-pointer transition-colors duration-200">
                                    <div className="flex items-center">
                                        <FolderIcon className="h-4 w-4 mr-2 text-yellow-500" />
                                        <span className="text-sm font-medium">{folder.name}</span>
                                    </div>
                                    <Badge variant="secondary" size={'xs'}>{folder.count} files</Badge>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="tertiary" className="flex items-center">
                            <UploadIcon className="mr-2 h-4 w-4" /> Upload File
                        </Button>
                        <Button variant="outline" className="flex items-center border-gray-600">
                            <FolderIcon className="mr-2 h-4 w-4" /> New Folder
                        </Button>
                        <Button variant="outline" className="flex items-center border-gray-600">
                            <ShareIcon className="mr-2 h-4 w-4" /> Share
                        </Button>
                        <Button variant="outline" className="flex items-center border-gray-600">
                            <StarIcon className="mr-2 h-4 w-4" /> Add to Favorites
                        </Button>
                        <Button variant="outline" className="flex items-center border-gray-600">
                            <TrashIcon className="mr-2 h-4 w-4" /> Trash
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}