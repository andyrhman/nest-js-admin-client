import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import http from "@/services/Api";
import authenticationService from "@/services/AuthenticationService";

// components
import { TrashIcon, PencilSquareIcon, MagnifyingGlassIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";

import {
  Typography,
  Button,
  CardFooter,
  IconButton,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// layout for page

import AdminNavbar from "@/components/Navbars/AdminNavbar.js";
import Sidebar from "@/components/Sidebar/Sidebar.js";
import HeaderStats from "@/components/Headers/HeaderStats.js";
import FooterAdmin from "@/components/Footers/FooterAdmin.js";
import Layout from "@/components/Layout";
import { NotificationDeleteDialog } from "@/components/admin/modals/delete.modal";

export default function OrdersTable({ color }) {
  // Getting the user data
  const [orders, setOrders] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
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
          const { data } = await http.get(`/orders?page=${page}`);

          setOrders(data.data);
          setLastPage(data.meta.last_page);

          if (searchResults.length > 0 && page !== 1) {
            findOrders(searchValue, page);
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

  const findOrders = async (searchValue, page = 1) => {
    try {
      const { data: searchData } = await authenticationService.findByOrders(searchValue, page);
      setSearchResults(searchData.data);
      setLastPage(searchData.meta.last_page);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(error);
        setSearchResults([]); // Clear search results if no data is found
      }
    }
  }

  // * Delete Modal
  const [openDialog, setOpenDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const handleOpenDialog = () => setOpenDialog(!openDialog);

  const handleConfirmDelete = async () => {
    await http.delete(`orders/${userIdToDelete}`);
    setProducts(products.filter((u) => u.id !== userIdToDelete));
    handleOpenDialog();
    toast.success('Order Deleted Successfully!.', {
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
    window.location.reload();
  };

  const del = (id) => {
    setUserIdToDelete(id);
    handleOpenDialog();
  };


  // * Show Order Item
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpen = (order) => {
    setOpen(true);
    setSelectedOrder(order);
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  }


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
                        Orders List
                      </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                      <div className="w-full md:w-72">
                        <Input
                          label="Search"
                          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                          onChange={(e) => { setSearchValue(e.target.value); findOrders(e.target.value); }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="block w-full overflow-x-auto">
                  {searchResults.length > 0 ? ( // Step 3: Display search results when available
                    searchResults.map((order) => (
                      <React.Fragment key={order.id}>
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
                                Total
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
                            <tr key={order.id}>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.name}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.email}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.total}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <Button color="green" className="items-center gap-3" onClick={() => handleOpen(order)}>
                                  <ShoppingBagIcon strokeWidth={2} className="h-4 w-4" />
                                </Button>

                                <Button color="red" className="items-center gap-3" onClick={() => del(order.id)}>
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
                    orders.map((order) => (
                      <React.Fragment key={order.id}>
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
                                Total
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
                            <tr key={order.id}>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.name}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.email}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.total}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <Button color="green" className="items-center gap-3" onClick={() => handleOpen(order)}>
                                  <ShoppingBagIcon strokeWidth={2} className="h-4 w-4" />
                                </Button>


                                <Button color="red" className="items-center gap-3" onClick={() => del(order.id)}>
                                  <TrashIcon strokeWidth={2} className="h-4 w-4" />
                                </Button>

                              </td>

                            </tr>
                          </tbody>


                        </table>
                        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                          {renderPagination()}
                        </CardFooter>

                        <Dialog open={open} handler={handleClose} size="lg">
                          <div className="flex items-center justify-between">
                            <DialogHeader>Create Products</DialogHeader>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="mr-3 h-5 w-5"
                              onClick={handleClose} // Change this line
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>

                          <DialogBody divider>
                            <div className="grid gap-6">
                              <table className="items-center w-full bg-transparent border-collapse">
                                <thead>
                                  <tr>
                                    <th
                                      className={
                                        "px-6 align-middle border border-solid py-3 text-xl uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                          ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                          : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                      }
                                    >
                                      Product Name
                                    </th>
                                    <th
                                      className={
                                        "px-6 align-middle border border-solid py-3 text-xl uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                          ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                          : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                      }
                                    >
                                      Quantity
                                    </th>
                                    <th
                                      className={
                                        "px-6 align-middle border border-solid py-3 text-xl uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                          ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                          : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                      }
                                    >
                                      Total
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedOrder && selectedOrder.order_items.map((item) => (
                                    <tr key={item.id}>
                                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4">
                                        {item.product_title}
                                      </td>
                                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4">
                                        {item.quantity}
                                      </td>
                                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4">
                                        {item.price}
                                      </td>
                                    </tr>

                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </DialogBody>
                          <DialogFooter className="space-x-2">
                            <Button variant="outlined" color="red" onClick={handleClose}>
                              Close
                            </Button>
                          </DialogFooter>
                        </Dialog>

                      </React.Fragment>

                    ))
                  )}
                  <NotificationDeleteDialog open={openDialog} handleOpenDelete={handleOpenDialog} handleConfirmDelete={handleConfirmDelete} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterAdmin />
    </Layout >
  );
}

OrdersTable.defaultProps = {
  color: "light",
};
