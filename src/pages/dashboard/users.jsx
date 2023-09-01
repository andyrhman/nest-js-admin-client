import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// components
import { UserPlusIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

import {
  Typography,
  Button,
  CardFooter,
  IconButton,
  Spinner
} from "@material-tailwind/react";

// layout for page

import AdminNavbar from "@/components/Navbars/AdminNavbar.js";
import Sidebar from "@/components/Sidebar/Sidebar.js";
import HeaderStats from "@/components/Headers/HeaderStats.js";
import FooterAdmin from "@/components/Footers/FooterAdmin.js";
import Layout from "@/components/Layout";


export default function UsersTable({ color }) {
  // Getting the user data
  const [users, setUsers] = useState([]);

  const [error, setError] = useState('');

  const router = useRouter();
  useEffect(() => {

    (
      async () => {
        try {
          const { data } = await axios.get('users');
          setUsers(data.data);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            setError('Authentication Error');

            // Set up a timer to redirect after 5 seconds
            setTimeout(() => {
              router.push('/login');
            }, 5000); // 5000 milliseconds = 5 seconds

          } else {
            setError('An error occurred');
            console.log(error);
          }

          if (error.response && error.response.status === 403) {
            setError('Authentication Error');

            // Set up a timer to redirect after 5 seconds
            setTimeout(() => {
              router.push('/dashboard');
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
        {users ? (
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
                              Users List
                            </Typography>
                          </div>
                          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <Button className="flex items-center gap-3" size="sm">
                              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add user
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
                                Name
                              </th>
                              <th
                                className={
                                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                  (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                }
                              >
                                Username
                              </th>
                              <th
                                className={
                                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                  (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                }
                              >
                                Email
                              </th>
                              <th
                                className={
                                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                  (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                }
                              >
                                Role
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
                            {users.map((user) =>
                              <tr key={user.id}>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                  {user.username}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                  {user.username}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                  {user.email}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                  <i className="fas fa-circle text-green-500 mr-2"></i> {user.role.name}
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
                            )}
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

UsersTable.defaultProps = {
  color: "light",
};
