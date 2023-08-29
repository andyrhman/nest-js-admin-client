import React from "react";

// components
import { BuildingStorefrontIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

import {
  Typography,
  Button,
  CardFooter,
  IconButton
} from "@material-tailwind/react";

// layout for page

import AdminNavbar from "@/components/Navbars/AdminNavbar.js";
import Sidebar from "@/components/Sidebar/Sidebar.js";
import HeaderStats from "@/components/Headers/HeaderStats.js";
import FooterAdmin from "@/components/Footers/FooterAdmin.js";
import Layout from "@/components/Layout";

export default function ProductsTable({ color }) {
  return (
    <Layout>
      <>
        <Sidebar />
        <div className="relative md:ml-64 bg-blueGray-100">
          <AdminNavbar />
          {/* Header */}
          <HeaderStats />
          <div className="px-4 md:px-10 mx-auto w-full -m-24">
            <div className="flex flex-wrap mt-4">
              <div className="w-full mb-12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded light bg-white" >
                  <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="mb-8 flex items-center justify-between gap-8">
                      <div>
                        <Typography variant="h5" color="blue-gray">
                          Products List
                        </Typography>
                      </div>
                      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button className="flex items-center gap-3" size="sm">
                          <BuildingStorefrontIcon strokeWidth={2} className="h-4 w-4" /> Add Product
                        </Button>
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
                            Project
                          </th>
                          <th
                            className={
                              "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                              (color === "light"
                                ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                            }
                          >
                            Budget
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
                            Users
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
                        <tr>
                          <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                            <img
                              src="/img/bootstrap.jpg"
                              className="h-12 w-12 bg-white rounded-full border"
                              alt="..."
                            ></img>{" "}
                            <span
                              className={
                                "ml-3 font-bold " +
                                +(color === "light" ? "text-blueGray-600" : "text-white")
                              }
                            >
                              Argon Design System
                            </span>
                          </th>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            $2,500 USD
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <i className="fas fa-circle text-orange-500 mr-2"></i> pending
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <div className="flex">
                              <img
                                src="/img/team-1-800x800.jpg"
                                alt="..."
                                className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
                              ></img>
                              <img
                                src="/img/team-2-800x800.jpg"
                                alt="..."
                                className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                              ></img>
                              <img
                                src="/img/team-3-800x800.jpg"
                                alt="..."
                                className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                              ></img>
                              <img
                                src="/img/team-4-470x470.png"
                                alt="..."
                                className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                              ></img>
                            </div>
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">

                            <Button color="blue" className="items-center gap-3">
                              <PencilSquareIcon strokeWidth={2} className="h-4 w-4" />
                            </Button>

                            <Button color="red" className="items-center gap-3">
                              <TrashIcon strokeWidth={2} className="h-4 w-4" />
                            </Button>

                          </td>

                        </tr>

                      </tbody>
                    </table>

                    <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                      <Button variant="outlined" size="sm">
                        Previous
                      </Button>
                      <div className="flex items-center gap-2">
                        <IconButton variant="outlined" size="sm">
                          1
                        </IconButton>
                        <IconButton variant="text" size="sm">
                          2
                        </IconButton>
                        <IconButton variant="text" size="sm">
                          3
                        </IconButton>
                        <IconButton variant="text" size="sm">
                          ...
                        </IconButton>
                        <IconButton variant="text" size="sm">
                          8
                        </IconButton>
                        <IconButton variant="text" size="sm">
                          9
                        </IconButton>
                        <IconButton variant="text" size="sm">
                          10
                        </IconButton>
                      </div>
                      <Button variant="outlined" size="sm">
                        Next
                      </Button>
                    </CardFooter>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterAdmin />

      </>
    </Layout>
  );
}

ProductsTable.defaultProps = {
  color: "light",
};

