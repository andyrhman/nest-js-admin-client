import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

// components
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option,
    Alert,
    Typography,
    CardFooter,
    IconButton,
} from "@material-tailwind/react";

import { UserPlusIcon, TrashIcon, PencilSquareIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User } from "@/models/user";
import authenticationService from "@/services/AuthenticationService";
import http from "@/services/Api";

// layout for page

import AdminNavbar from "@/components/Navbars/AdminNavbar.js";
import Sidebar from "@/components/Sidebar/Sidebar.js";
import HeaderStats from "@/components/Headers/HeaderStats.js";
import FooterAdmin from "@/components/Footers/FooterAdmin.js";
import Layout from "@/components/Layout";
import CreateUser from "@/pages/dashboard/users/create.user";

export default function EditUser({ color }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [role_id, setRoleId] = useState('');
    const [roleIdError, setRoleIdError] = useState(false);
    const [error, setError] = useState('');

    const [roles, setRoles] = useState([]);
    // Inside your component
    const router = useRouter();
    const { id } = router.query; // `id` will be the user ID from the URL


    useEffect(() => {
        if (id) {
            (
                async () => {
                    try {
                        const response = await http.get('/roles');
                        setRoles(response.data);

                        const { data } = await http.get(`/users/${id}`);
                        setUsername(data.username);
                        setEmail(data.email);
                        setRoleId(data.role.id);
                    } catch (error) {
                        if (error.response && error.response.status === 400) {
                            setError('Invalid UUID format');
                        }
                        if (error.response && error.response.status === 401) {
                            setError('An error occurred');
                            router.push('/login');
                        }

                        if (error.response && error.response.status === 403) {
                            setError('An error occurred');
                            router.push('/login');
                        }
                    }
                }
            )()
        }
    }, [id]); // Add id as a dependency here


    const submit = async (e) => {
        e.preventDefault();
        setEmailError(false);
        setUsernameError(false);
        setRoleIdError(false);
        setError('');

        try {
            const { data } = await http.put(`users/${id}`, {
                username,
                email,
                role_id
            });
            if (data) {
                // Show a success message using React Toastify
                toast.success('User Created Successfully!.', {
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
                setOpen(!open);
                setTimeout(() => {
                    router.push('/dashboard/users');
                }, 3000);
            } else {
                // Sign-in failed, display an error message
                setError('An error occurred during sign-in');
            }
        } catch (error) {
            console.error(error.response);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);

                // Set error flags based on the error message
                if (errorMessage.includes('Username')) {
                    setUsernameError(errorMessage);
                }
                if (errorMessage.includes('Email')) {
                    setEmailError(errorMessage);
                }
                if (errorMessage.includes('Email')) {
                    setRoleIdError(errorMessage);
                }
            }
        }

    }

    // Getting the user data
    const [users, setUsers] = useState([]);
    const [Datauser, setUser] = useState(new User());
    const [searchResults, setSearchResults] = useState([]); // Step 1: Create a state variable for search results
    const [searchValue, setSearchValue] = useState("");

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
                    }

                    if (error.response && error.response.status === 403) {
                        setError('Authentication Error');
                        router.push('/dashboard');
                    }
                }
            }
        )();


    }, [page]);

    // * Validation
    const validateUsername = async () => {
        // Reset the error message
        setUsernameError('');

        if (username === '') {
            // If the username field is empty, display an error message
            setUsernameError('Username is required');
        } else {
            // Make an API request to validate the username
            try {
                const response = await authenticationService.findByTitle(username);
                if (response.data.length > 0) {
                    // If the username already exists, display an error message
                    setUsernameError('Username already exists');
                }
            } catch (error) {
                // console.error(error);
                // Handle the error response if necessary
            }
        }
    };

    const validateEmail = async () => {
        // Reset the error message
        setEmailError('');

        if (email === '') {
            // If the email field is empty, display an error message
            setEmailError('Email is required');
        } else {
            // Make an API request to validate the email
            try {
                const response = await authenticationService.findByTitle(email);
                if (response.data.length > 0) {
                    // If the email already exists, display an error message
                    setEmailError('Email already exists');
                }
            } catch (error) {
                // console.error(error);
                // Handle the error response if necessary
            }
        }
    };


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

    // Create Modal
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);

    const openModalCreate = () => {
        setIsModalOpenCreate(true);
    };

    const closeModalCreate = () => {
        setIsModalOpenCreate(false);
    };

    // Edit Modal
    const [open, setOpen] = useState(true);

    const handleOpen = () => {
        router.push('/dashboard/users');
        setOpen(!open);
    };


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

                                                                {renderPaginationSearch()}
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Dialog open={open} handler={handleOpen}>
                            <div className="flex items-center justify-between">
                                <DialogHeader>Create New User</DialogHeader>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="mr-3 h-5 w-5"
                                    onClick={handleOpen} // Change this line
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <form onSubmit={submit}>
                                <DialogBody divider>
                                    <div className="grid gap-6">
                                        {error && (
                                            <Alert color="red" className="mt-2 text-center font-normal">
                                                {error}
                                            </Alert>
                                        )}

                                        <div className="mb-5">
                                            <Input
                                                label="Username"
                                                defaultValue={username}
                                                error={!!usernameError} // Pass the error state as a prop
                                                onChange={(e) => setUsername(e.target.value)}
                                                onBlur={validateUsername}

                                            />
                                            {usernameError && <div className="text-red-500 text-xs mt-1">{usernameError}</div>}
                                        </div>
                                        <div className="mb-5">
                                            <Input
                                                label="Email"
                                                type="email"
                                                defaultValue={email}
                                                error={!!emailError} // Pass the error state as a prop
                                                onChange={(e) => setEmail(e.target.value)}
                                                onBlur={validateEmail}

                                            />
                                            {emailError && <div className="text-red-500 text-xs mt-1">{emailError}</div>}
                                        </div>

                                        <div className="mb-5 relative">
                                            <select
                                                className="block appearance-none w-full bg-gray-200 border border-gray-400 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state"
                                                value={role_id}
                                                onChange={e => setRoleId(e.target.value)}
                                            >
                                                {roles.map((role) => (
                                                    <option key={role.id} value={role.id}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                            </div>
                                            {roleIdError && <div className="text-red-500 text-xs mt-1">{roleIdError}</div>}
                                        </div>



                                    </div>
                                </DialogBody>
                                <DialogFooter className="space-x-2">
                                    <Button variant="outlined" color="red" onClick={handleOpen}>
                                        close
                                    </Button>
                                    <Button variant="gradient" color="blue" type='submit'>
                                        Submit
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Dialog>
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

EditUser.defaultProps = {
    color: "light",
};