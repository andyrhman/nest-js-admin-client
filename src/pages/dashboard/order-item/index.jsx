import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import http from "@/services/Api";

// components
import { PencilSquareIcon } from "@heroicons/react/24/solid";

import {
    Typography,
    Button
} from "@material-tailwind/react";

import 'react-toastify/dist/ReactToastify.css';

// layout for page

import AdminWrapper from "@/components/admin/AdminWrapper";

export default function OrderItemTable({ color }) {
    // Getting the user data
    const [orders, setOrders] = useState([]);

    const [error, setError] = useState('');

    const router = useRouter();

    useEffect(() => {

        (
            async () => {
                try {
                    const { data } = await http.get(`/order-item`);

                    setOrders(data);

                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        setError('Authentication Error');
                        router.push('/login');
                    }

                    if (error.response && error.response.status === 403) {
                        setError('Authentication Error');
                        router.push('/dashboard');
                    }
                }
            }
        )();
    }, []);



    return (
        <AdminWrapper>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded light bg-white" >
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="mb-2 flex items-center justify-between gap-8">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Order Item List
                            </Typography>
                        </div>
                    </div>
                </div>

                <div className="block w-full overflow-x-auto">

                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                            <tr>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                    }
                                >
                                    Product
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                    }
                                >
                                    Price
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                    }
                                >
                                    Quantity
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                    }
                                >
                                    Status
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                    }
                                >
                                    Action
                                </th>

                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <React.Fragment key={order.id}>
                                    <tr key={order.id}>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            {order.product_title}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            {order.price}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            {order.quantity}
                                        </td>
                                        <td
                                            className={`border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ${order.status === "Sedang Dikemas"
                                                ? "text-purple-500"
                                                : order.status === "Dikirim"
                                                    ? "text-blue-500"
                                                    : "text-green-500"
                                                }`}
                                        >
                                        <i className={`fas fa-circle mr-2 ${order.status === "Sedang Dikemas" ? "text-purple-500" : order.status === "Dikirim" ? "text-blue-500" : "text-green-500"}`}></i>{" "}
                                            {order.status}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            <Link href={`/dashboard/order-item/${order.id}`}>
                                                <Button color="blue" className="items-center gap-3">
                                                    <PencilSquareIcon strokeWidth={2} className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                        </td>

                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>


                    </table>

                </div>
            </div>
        </AdminWrapper >
    );
}

OrderItemTable.defaultProps = {
    color: "light",
};
