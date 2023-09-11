import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

// components

import CardSettings from "@/components/Cards/CardSettings.js";
import CardProfile from "@/components/Cards/CardProfile.js";
import {
  Typography,
  Button,
  Spinner
} from "@material-tailwind/react";

// layout for page

import AdminNavbar from "@/components/admin/Navbars/AdminNavbar.js";
import Sidebar from "@/components/admin/Sidebar/Sidebar.js";
import HeaderStats from "@/components/admin/Headers/HeaderStats.js";
import FooterAdmin from "@/components/admin/Footers/FooterAdmin.js";
import Layout from "@/components/Layout";

export default function Settings() {
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
            setError('Authentication Error');

            // Set up a timer to redirect after 5 seconds
            setTimeout(() => {
              router.push('login');
            }, 5000); // 5000 milliseconds = 5 seconds

          } else {
            setError('An error occurred');
            console.log(error);
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
                  <div className="w-full lg:w-8/12 px-4">
                    <CardSettings />
                  </div>
                  <div className="w-full lg:w-4/12 px-4">
                    <CardProfile />
                  </div>
                </div>
              </div>
            </div>
            <FooterAdmin />
          </>
        ) : (
          <>
            {error && (
              <div className="relative my-44">
                <div className="flex justify-center mb-6">
                  <Spinner color="purple" className="h-16 w-16 text-gray-900/50" />
                </div>
              </div>
            )}
          </>
        )}


      </>
    </Layout>
  );
}

