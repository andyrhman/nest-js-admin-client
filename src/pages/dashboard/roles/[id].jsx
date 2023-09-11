import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import http from "@/services/Api";

// components
import { UserPlusIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

import {
    Typography,
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Alert,
    List,
    ListItem,
    Checkbox
} from "@material-tailwind/react";

import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// layout for page

import AdminNavbar from "@/components/admin/Navbars/AdminNavbar.js";
import Sidebar from "@/components/admin/Sidebar/Sidebar.js";
import HeaderStats from "@/components/admin/Headers/HeaderStats.js";
import FooterAdmin from "@/components/admin/Footers/FooterAdmin.js";
import Layout from "@/components/Layout";
import { NotificationDeleteDialog } from "@/components/admin/modals/delete.modal";
import CreateRole from "./create.roles";

export default function EditRoles({ color }) {
    const [name, setName] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [selected, setSelected] = useState([]);

    const [error, setError] = useState('');

    const [roles, setRoles] = useState([])

    const router = useRouter();
    const { id } = router.query;
    useEffect(() => {
        if (id) {
            (
                async () => {
                    try {
                        const response = await http.get('/permissions');
                        setPermissions(response.data);

                        const {data} = await http.get(`/roles/${id}`);
                        
                        setName(data.name);
                        setSelected(data.permissions.map((permission) => permission.id));
                    } catch (error) {
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

    }, [id]);

    const check = (id) => {
        if (selected.some(s => s === id)) {
            setSelected(selected.filter(s => s !== id));
            return;
        }
        setSelected([...selected, id]);
    }

    const submit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const { data } = await http.put(`/roles/${id}`, {
                name,
                permissions: selected
            });
            if (data) {
                // Show a success message using React Toastify
                toast.success('Role Updated Successfully!.', {
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
                    router.push('/dashboard/roles');
                }, 2000);
                setOpen(!open);
            } else {
                // Sign-in failed, display an error message
                setError('An error occurred during sign-in');
            }
        } catch (error) {
            console.error(error.response);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);
            }
        }

    }

    useEffect(() => {

        (
            async () => {
                try {
                    const { data } = await http.get('/roles');

                    setRoles(data);
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

    // * Delete Modal
    const [openDialog, setOpenDialog] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    const handleOpenDialog = () => setOpenDialog(!openDialog);

    const handleConfirmDelete = async () => {
        await http.delete(`roles/${userIdToDelete}`);
        setRoles(roles.filter((u) => u.id !== userIdToDelete));
        handleOpenDialog();
        toast.success('Role Deleted Successfully!.', {
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
    };

    const del = (id) => {
        setUserIdToDelete(id);
        handleOpenDialog();
    };


    // * Create Modal
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);

    const openModalCreate = () => {
        setIsModalOpenCreate(true);
    };

    const closeModalCreate = () => {
        setIsModalOpenCreate(false);
    };

    // * Edit Modal
    const [open, setOpen] = useState(true);

    const handleOpen = () => {
        router.push('/dashboard/roles');
        setOpen(!open);
    };

    return (
        <Layout>

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
                                                Roles List
                                            </Typography>
                                        </div>
                                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                            <Button className="flex items-center gap-3" size="sm" onClick={openModalCreate}>
                                                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Role
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
                                                    Action
                                                </th>

                                            </tr>
                                        </thead>
                                        {/* //* {roles.map((role) => ())} */}
                                        {roles.map((role) => (
                                            <tbody key={role.id}>
                                                <tr>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {role.name}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <Link href={`/dashboard/roles/${role.id}`}>
                                                            <Button color="blue" className="items-center gap-3">
                                                                <PencilSquareIcon strokeWidth={2} className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        <Button color="red" className="items-center gap-3" onClick={() => del(role.id)}>
                                                            <TrashIcon strokeWidth={2} className="h-4 w-4" />
                                                        </Button>

                                                    </td>

                                                </tr>
                                            </tbody>
                                        ))}

                                    </table>
                                    <CreateRole isOpen={isModalOpenCreate} onClose={closeModalCreate} />
                                    <NotificationDeleteDialog open={openDialog} handleOpenDelete={handleOpenDialog} handleConfirmDelete={handleConfirmDelete} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={open} handler={handleOpen}>
                <div className="flex items-center justify-between">
                    <DialogHeader>Edit Role</DialogHeader>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-3 h-5 w-5"
                        onClick={handleOpen}
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
                                    label="Name"
                                    required
                                    defaultValue={name}
                                    onChange={(e) => setName(e.target.value)}

                                />
                            </div>

                            <div className="mb-5">
                                <Typography color="blue-gray" className="font-medium">
                                    Permissions
                                </Typography>
                                <List className="grid grid-cols-3 gap-3">
                                    {permissions.map((permission) => (
                                        <ListItem key={permission.id}>
                                            <Checkbox
                                                color="blue"
                                                ripple={false}
                                                className="hover:before:opacity-0"
                                                containerProps={{
                                                    className: "p-2",
                                                }}
                                                label={permission.name}
                                                value={permission.id}
                                                checked={selected.some(s => s === permission.id)}
                                                onChange={() => check(permission.id)}
                                            />
                                        </ListItem>
                                    ))}
                                </List>


                            </div>

                        </div>
                    </DialogBody>
                    <DialogFooter className="space-x-2">
                        <Button variant="outlined" color="red" onClick={handleOpen}>
                            Close
                        </Button>
                        <Button variant="gradient" color="blue" type='submit'>
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
            <FooterAdmin />
        </Layout>
    );
}

EditRoles.defaultProps = {
    color: "light",
};
