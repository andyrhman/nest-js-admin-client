import React from "react";

// Components
import CardLineChart from "@/components/admin/Cards/CardLineChart";

// layout for page
import AdminWrapper from "@/components/admin/AdminWrapper";

export default function index() {
    return (
        <AdminWrapper>
            <CardLineChart />
        </AdminWrapper>
    );
}


