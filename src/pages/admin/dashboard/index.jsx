import { useState, useEffect } from 'react';
import Head from "next/head";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faFileAlt, faCalendarDay, faCalendarWeek, faCalendarAlt } from '@awesome.me/kit-9b926a9ec0/icons/classic/regular';
//import Table from '@/components/ui/table';

import Table from "@/components/core/Table";
import {dmsApi} from "@/../client";

const Dashboard = () => {

    const [Cards, setCards] = useState([
        {
            icon: faFileAlt,
            number: "",
            title: "Total Documents",
            bgColor: "bg-blue-500",
        },
        {
            icon: faCalendarDay,
            number: "",
            title: "Created Today",
            bgColor: "bg-green-500",
        },
        {
            icon: faCalendarWeek,
            number: "",
            title: "Created Weekly",
            bgColor: "bg-yellow-500",
        },
        {
            icon: faCalendarAlt,
            number: "",
            title: "Created Monthly",
            bgColor: "bg-red-500",
        },
    ])
    // const [Counts, SetCounts] = useState({})

    useEffect(() => {
        dmsApi.get("/dms/query/DashboardCountDms?userId=").then((res) => {
            console.log(res, " Table res");
            const tempCards = [...Cards]
            
            tempCards[0].number = res.data?.totalDocument;
            tempCards[1].number = res.data?.documentCountToday;
            tempCards[2].number = res.data?.documentCountWeekly;
            tempCards[3].number = res.data?.documentCountMonthly;
            // SetCounts(res);
            setCards(tempCards);

        }).catch((e) => {
            // setFetchedData(null);

            console.log(e, " error Admin dashboard");
        });
    }, [])

    return (
        <main className={"p-4 mx-2 mt-2 flex flex-col gap-4"}>
            {/* <Button className="mb-3"
                onClick={() => { alert("To be Added...")}}
                primary
                text="Create"
            /> */}
            <Head>
                <title>Admin Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h2 className={"text-2xl font-semibold text-primary-900 dark:text-primary-300"}>
                Admin Dashboard
            </h2>

            <div className="flex flex-wrap -mx-4">
                {Cards.map((card, index) => (
                    <div key={index} className="w-full md:w-1/2 lg:w-1/4 p-4">
                        <div className={`flex items-center p-6 rounded-lg shadow-md ${card.bgColor}`}>
                            <div className="p-3 mr-4 rounded-full bg-white">
                                <FontAwesomeIcon icon={card.icon} size={"1x"}/>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{card.number}</p>
                                <p className="text-white">{card.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Table
                columnDefs={[
                    {
                        field: 'OwnerUserName',
                        headerName: 'User Name'
                    },
                    {
                        field: 'ShareCount',
                        headerName: 'Document Count'
                    },
                ]}

                source= "/dms/query/ReadUserDocumentCountDMS?userId"
            />
        </main>
    )
}

export default Dashboard;
