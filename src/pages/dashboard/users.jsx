import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { User } from "@/models/user";
import authenticationService from "@/services/AuthenticationService";

// components
import { UserPlusIcon, TrashIcon, PencilSquareIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import {
  Typography,
  Button,
  CardFooter,
  IconButton,
  Spinner,
  Input
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
  const [Datauser, setUser] = useState(new User());
  const [searchResults, setSearchResults] = useState([]); // Step 1: Create a state variable for search results
  const [searchValue, setSearchValue] = useState("");

  const [error, setError] = useState('');

  const router = useRouter();

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  useEffect(() => {

    (
      async () => {
        try {
          const { data: userData } = await axios.get('user');
          setUser(new User(
            userData.id,
            userData.username,
            userData.email
          ));

          const { data: data } = await axios.get(`users?page=${page}`);

          setUsers(data.data);
          setLastPage(data.meta.last_page);

          if (searchResults.length > 0 && page !== 1) {
            findUser(searchValue, page);
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            setError('Authentication Error');

            router.push('/login');

          } else {
            setError('An error occurred');
            console.log(error);
          }

          if (error.response && error.response.status === 403) {
            setError('Authentication Error');

            router.push('/dashboard');

          } else {
            setError('An error occurred');
            console.log(error);
          }
        }
      }
    )();


  }, [page]);

  const next = () => {
    if (page < lastPage) {
      setPage(page + 1);
    }
  };

  const prev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const nextSearch = () => {
    if (page < lastPage) {
      const newPage = page + 1;
      setPage(newPage);
      return newPage;
    }
    return page;
  };

  const prevSearch = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      return newPage;
    }
    return page;
  };


  const del = async (id) => {
    if (window.confirm("Delete this user?")) {
      await axios.delete(`users/${id}`);

      setUsers(users.filter((u) => u.id !== id));

      window.location.reload();
    }
  }

  const findUser = async (searchValue, page = 1) => {
    try {
      const { data: searchData } = await authenticationService.findByTitle(searchValue, page);
      setSearchResults(searchData.data);
      setLastPage(searchData.meta.last_page);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(error);
        setSearchResults([]); // Clear search results if no data is found
      }
    }
  }

  return (
    <Layout>
      <>
        {Datauser ? (
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
                            <div className="w-full md:w-72">
                              <Input
                                label="Search"
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                onChange={(e) => { setSearchValue(e.target.value); findUser(e.target.value); }}
                              />
                            </div>
                            <Button className="flex items-center gap-3" size="sm">
                              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add user
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="block w-full overflow-x-auto">
                        {searchResults.length > 0 ? ( // Step 3: Display search results when available
                          searchResults.map((user) => (
                            // * Use React.Fragment if you don't want error to show in your console that says
                            // ! Warning: Each child in a list should have a unique "key" prop.
                            <React.Fragment key={user.id}>
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
                                    <td
                                      className={`border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ${user.role.name === "Admin"
                                        ? "text-purple-500"
                                        : user.role.name === "Moderator"
                                          ? "text-blue-500"
                                          : "text-green-500"
                                        }`}
                                    >
                                      <i className={`fas fa-circle mr-2 ${user.role.name === "Admin" ? "text-purple-500" : user.role.name === "Moderator" ? "text-blue-500" : "text-green-500"}`}></i>{" "}
                                      {user.role.name}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">

                                      <Button color="blue" className="items-center gap-3">
                                        <PencilSquareIcon strokeWidth={2} className="h-4 w-4" />
                                      </Button>

                                      <Button color="red" className="items-center gap-3" onClick={() => del(user.id)}>
                                        <TrashIcon strokeWidth={2} className="h-4 w-4" />
                                      </Button>

                                    </td>

                                  </tr>
                                </tbody>
                              </table>

                              <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">

                                <Button variant="outlined" size="sm" onClick={() => searchValue ? findUser(searchValue, next()) : next()}>
                                  Next
                                </Button>

                                <Button variant="outlined" size="sm" onClick={() => searchValue ? findUser(searchValue, prev()) : prev()}>
                                  Previous
                                </Button>
                              </CardFooter>

                            </React.Fragment>


                          ))
                        ) : (
                          // Display regular users list when there are no search results
                          users.map((user) => (
                            // * Use React.Fragment if you don't want error to show in your console that says
                            // ! Warning: Each child in a list should have a unique "key" prop.
                            <React.Fragment key={user.id}>
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
                                    <td
                                      className={`border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ${user.role.name === "Admin"
                                        ? "text-purple-500"
                                        : user.role.name === "Moderator"
                                          ? "text-blue-500"
                                          : "text-green-500"
                                        }`}
                                    >
                                      <i className={`fas fa-circle mr-2 ${user.role.name === "Admin" ? "text-purple-500" : user.role.name === "Moderator" ? "text-blue-500" : "text-green-500"}`}></i>{" "}
                                      {user.role.name}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">

                                      <Button color="blue" className="items-center gap-3">
                                        <PencilSquareIcon strokeWidth={2} className="h-4 w-4" />
                                      </Button>

                                      <Button color="red" className="items-center gap-3" onClick={() => del(user.id)}>
                                        <TrashIcon strokeWidth={2} className="h-4 w-4" />
                                      </Button>

                                    </td>

                                  </tr>
                                </tbody>
                              </table>
                              <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                                <Button variant="outlined" size="sm" onClick={prev}>
                                  Previous
                                </Button>

                                <Button variant="outlined" size="sm" onClick={next}>
                                  Next
                                </Button>
                              </CardFooter>
                            </React.Fragment>

                          ))
                        )}


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
