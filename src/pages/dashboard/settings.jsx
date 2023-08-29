import React from "react";

// components

import CardSettings from "@/components/Cards/CardSettings.js";
import CardProfile from "@/components/Cards/CardProfile.js";

// layout for page

import AdminNavbar from "@/components/Navbars/AdminNavbar.js";
import Sidebar from "@/components/Sidebar/Sidebar.js";
import HeaderStats from "@/components/Headers/HeaderStats.js";
import FooterAdmin from "@/components/Footers/FooterAdmin.js";
import Layout from "@/components/Layout";

export default function Settings() {
  return (
    <Layout>
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
    </Layout>
  );
}

