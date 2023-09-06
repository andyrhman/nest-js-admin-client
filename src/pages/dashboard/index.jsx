import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

// Components

import { Spinner } from "@material-tailwind/react";
import CardLineChart from "@/components/Cards/CardLineChart";
import CardBarChart from "@/components/Cards/CardBarChart";
import CardPageVisits from "@/components/Cards/CardPageVisits";
import CardSocialTraffic from "@/components/Cards/CardSocialTraffic";

// layout for page

import AdminNavbar from "@/components/Navbars/AdminNavbar.js";
import Sidebar from "@/components/Sidebar/Sidebar.js";
import HeaderStats from "@/components/Headers/HeaderStats.js";
import FooterAdmin from "@/components/Footers/FooterAdmin.js";
import Layout from "@/components/Layout";


export default function index() {
    // Getting the user data
    const [user, setUser] = useState('');

    const [error, setError] = useState('');

    const router = useRouter();
    useEffect(() => {

        (
            async () => {
                try {
                    const { data } = await axios.get('user');
                    setUser(data);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        setError('An error occurred');
                        router.push('login');
                    }
                }
            }
        )();


    }, [])

    return (
        <Layout>
            <>

                {user ? (
                    <>
                        <Sidebar />
                        <div className="relative md:ml-64 bg-blueGray-100">
                            <AdminNavbar />
                            {/* Header */}
                            <HeaderStats />
                            <div className="px-4 md:px-10 mx-auto w-full -m-24">

                                <div className="flex flex-wrap">
                                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                                        <CardLineChart />
                                    </div>
                                    <div className="w-full xl:w-4/12 px-4">
                                        <CardBarChart />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4">
                                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                                        <CardPageVisits />
                                    </div>
                                    <div className="w-full xl:w-4/12 px-4">
                                        <CardSocialTraffic />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <FooterAdmin />
                    </>
                ) : (
                    <>
                        {error && (
                            <style jsx global>
                                {`
                                    body {
                                        background: white;
                                    }
                                `}
                            </style>
                        )}
                    </>

                )}


            </>
        </Layout>
    );
}


