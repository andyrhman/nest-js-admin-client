import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import http from "@/services/Api";
import authenticationService from "@/services/AuthenticationService";

// components
import { UserPlusIcon, TrashIcon, PencilSquareIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import {
  Typography,
  Button,
  CardFooter,
  IconButton,
  Input
} from "@material-tailwind/react";

import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// layout for page

import AdminWrapper from "@/components/admin/AdminWrapper";
import CreateUser from "@/pages/dashboard/users/create.user";
import { NotificationDeleteDialog } from "@/components/admin/modals/delete.modal";

export default function UsersTable({ color }) {
  // Getting the user data
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]); // Step 1: Create a state variable for search results
  const [searchValue, setSearchValue] = useState("");

  const [error, setError] = useState('');

  const router = useRouter();

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const pages = [];

  const [inputPage, setInputPage] = useState('');
  const [isInputActive, setInputActive] = useState(false);
  const [ellipsisClicked, setEllipsisClicked] = useState(false);

  useEffect(() => {

    (
      async () => {
        try {
          const { data: data } = await http.get(`users?page=${page}`);

          setUsers(data.data);
          setLastPage(data.meta.last_page);

          if (searchResults.length > 0 && page !== 1) {
            findUser(searchValue, page);
          }
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


  }, [page]);

  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= lastPage) {
      setPage(pageNumber);
    }
  };

  const renderPagination = () => {


    const handleInputPageChange = (e) => {
      setInputPage(e.target.value);
    };

    const handleInputPageKeyPress = (e) => {
      if (e.key === "Enter") {
        const pageNumber = parseInt(inputPage);
        if (pageNumber >= 1 && pageNumber <= lastPage) {
          handlePageClick(pageNumber);
        }
        setInputPage('');
        setInputActive(false);
      }
    };

    for (let i = 1; i <= lastPage; i++) {
      if (i === 1 || i === lastPage || (i >= page - 1 && i <= page + 1)) {
        pages.push(
          <IconButton
            key={i}
            size="sm"
            onClick={() => handlePageClick(i)}
            variant={i === page ? "outlined" : "text"}
          >
            {i}
          </IconButton>
        );
      } else if (i === page - 2 || i === page + 2) {
        // Show ellipsis for skipped pages, or input if clicked
        pages.push(
          <div key={i}>
            {ellipsisClicked ? (
              <input
                type="number"
                value={inputPage}
                onChange={handleInputPageChange}
                onKeyUp={handleInputPageKeyPress}
                className="border rounded-md p-1 w-10 text-center"
                placeholder="..."
                min="1" // Set the minimum value to 1
              />
            ) : (
              <span
                className="text-gray-500 cursor-pointer"
                onClick={() => setEllipsisClicked(true)}
              >
                ...
              </span>
            )}
          </div>
        );
      }
    }

    return (
      <>
        <Button
          variant="outlined"
          size="sm"
          onClick={prev}
          disabled={page === 1}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {pages}
        </div>
        <Button
          variant="outlined"
          size="sm"
          onClick={next}
          disabled={page === lastPage}
        >
          Next
        </Button>
      </>
    );
  };

  const renderPaginationSearch = () => {

    const handleInputPageChange = (e) => {
      setInputPage(e.target.value);
    };

    const handleInputPageKeyPress = (e) => {
      if (e.key === "Enter") {
        const pageNumber = parseInt(inputPage);
        if (pageNumber >= 1 && pageNumber <= lastPage) {
          handlePageClick(pageNumber);
        }
        setInputPage('');
        setInputActive(false);
      }
    };

    for (let i = 1; i <= lastPage; i++) {
      if (i === 1 || i === lastPage || (i >= page - 1 && i <= page + 1)) {
        pages.push(
          <IconButton
            key={i}
            size="sm"
            onClick={() => handlePageClick(i)}
            variant={i === page ? "outlined" : "text"}
          >
            {i}
          </IconButton>
        );
      } else if (i === page - 2 || i === page + 2) {
        // Show ellipsis for skipped pages, or input if clicked
        pages.push(
          <div key={i}>
            {ellipsisClicked ? (
              <input
                type="number"
                value={inputPage}
                onChange={handleInputPageChange}
                onKeyUp={handleInputPageKeyPress}
                className="border rounded-md p-1 w-10 text-center"
                placeholder="..."
                min="1" // Set the minimum value to 1
              />
            ) : (
              <span
                className="text-gray-500 cursor-pointer"
                onClick={() => setEllipsisClicked(true)}
              >
                ...
              </span>
            )}
          </div>
        );
      }
    }

    return (
      <>
        <Button
          variant="outlined"
          size="sm"
          onClick={() => searchValue ? findUser(searchValue, prev()) : prev()}
          disabled={page === 1}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {pages}
        </div>
        <Button
          variant="outlined"
          size="sm"
          onClick={() => searchValue ? findUser(searchValue, next()) : next()}
          disabled={page === lastPage}
        >
          Next
        </Button>
      </>
    );
  };

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

  // * Delete Modal
  const [openDialog, setOpenDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const handleOpenDialog = () => setOpenDialog(!openDialog);

  const handleConfirmDelete = async () => {
    await http.delete(`users/${userIdToDelete}`);
    setUsers(users.filter((u) => u.id !== userIdToDelete));
    handleOpenDialog();
    toast.success('User Deleted Successfully!.', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const del = (id) => {
    setUserIdToDelete(id);
    handleOpenDialog();
  };

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

  // Create Modal
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);

  const openModalCreate = () => {
    setIsModalOpenCreate(true);
  };

  const closeModalCreate = () => {
    setIsModalOpenCreate(false);
  };

  return (
    <AdminWrapper>
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
              <Button className="flex items-center gap-3" size="sm" onClick={openModalCreate}>
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
                        <Link href={`/dashboard/users/${user.id}`}>
                          <Button color="blue" className="items-center gap-3">
                            <PencilSquareIcon strokeWidth={2} className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button color="red" className="items-center gap-3" onClick={() => del(user.id)}>
                          <TrashIcon strokeWidth={2} className="h-4 w-4" />
                        </Button>
                      </td>

                    </tr>
                  </tbody>
                </table>

                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">

                  {renderPaginationSearch()}
                </CardFooter>

              </React.Fragment>


            ))
          ) : (
            // Display regular users list when there are no search results
            // * {users.map((users) => ())}
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
                        <Link href={`/dashboard/users/${user.id}`}>
                          <Button color="blue" className="items-center gap-3">
                            <PencilSquareIcon strokeWidth={2} className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button color="red" className="items-center gap-3" onClick={() => del(user.id)}>
                          <TrashIcon strokeWidth={2} className="h-4 w-4" />
                        </Button>

                      </td>

                    </tr>
                  </tbody>
                </table>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                  {renderPagination()}
                </CardFooter>
              </React.Fragment>

            ))
          )}

          <CreateUser isOpen={isModalOpenCreate} onClose={closeModalCreate} />
          <NotificationDeleteDialog open={openDialog} handleOpenDelete={handleOpenDialog} handleConfirmDelete={handleConfirmDelete} />
        </div>
      </div>
    </AdminWrapper>
  );
}

UsersTable.defaultProps = {
  color: "light",
};
