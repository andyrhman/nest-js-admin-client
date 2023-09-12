import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import http from "@/services/Api";

// components
import { UserPlusIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

import {
  Typography,
  Button
} from "@material-tailwind/react";

import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// layout for page

import AdminWrapper from "@/components/admin/AdminWrapper";
import { NotificationDeleteDialog } from "@/components/admin/modals/delete.modal";
import CreateRole from "./create.roles";

export default function RolesTable({ color }) {
  // Getting the user data
  const [roles, setRoles] = useState([]);

  const [error, setError] = useState('');

  const router = useRouter();

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


  return (
    <AdminWrapper>
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
    </AdminWrapper>
  );
}

RolesTable.defaultProps = {
  color: "light",
};
