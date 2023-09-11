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
  Input,
  Avatar
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
import CreateProducts from "./create.products";

export default function ProductsTable({ color }) {
  // Getting the user data
  const [products, setProducts] = useState([]);
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
          const { data } = await http.get(`/products?page=${page}`);

          setProducts(data.data);
          setLastPage(data.meta.last_page);

          if (searchResults.length > 0 && page !== 1) {
            findProducts(searchValue, page);
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

  const findProducts = async (searchValue, page = 1) => {
    try {
      const { data: searchData } = await authenticationService.findByProducts(searchValue, page);
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
    await http.delete(`products/${userIdToDelete}`);
    setProducts(products.filter((u) => u.id !== userIdToDelete));
    handleOpenDialog();
    toast.success('Products Deleted Successfully!.', {
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


  // * Create Modal
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);

  const openModalCreate = () => {
    setIsModalOpenCreate(true);
  };

  const closeModalCreate = () => {
    setIsModalOpenCreate(false);
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
                        Products List
                      </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                      <div className="w-full md:w-72">
                        <Input
                          label="Search"
                          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                          onChange={(e) => { setSearchValue(e.target.value); findProducts(e.target.value); }}
                        />
                      </div>
                      <Button className="flex items-center gap-3" size="sm" onClick={openModalCreate}>
                        <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Product
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="block w-full overflow-x-auto">
                  {searchResults.length > 0 ? ( // Step 3: Display search results when available
                    searchResults.map((product) => (
                      <React.Fragment key={product.id}>
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
                                Title
                              </th>
                              <th
                                className={
                                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                  (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                }
                              >
                                Description
                              </th>
                              <th
                                className={
                                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                  (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                }
                              >
                                Image
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
                                Action
                              </th>

                            </tr>
                          </thead>

                          <tbody>
                            <tr key={product.id}>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {product.title}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {product.description}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <img
                                  className="w-full object-cover object-center"
                                  src={product.image}
                                  alt={product.title}
                                />
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {product.price}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <Link href={`/dashboard/products/${product.id}`}>
                                  <Button color="blue" className="items-center gap-3">
                                    <PencilSquareIcon strokeWidth={2} className="h-4 w-4" />
                                  </Button>
                                </Link>

                                <Button color="red" className="items-center gap-3" onClick={() => del(product.id)}>
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
                    products.map((product) => (
                      <React.Fragment key={product.id}>
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
                                Title
                              </th>
                              <th
                                className={
                                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                  (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                }
                              >
                                Description
                              </th>
                              <th
                                className={
                                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                  (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                }
                              >
                                Image
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
                                Action
                              </th>

                            </tr>
                          </thead>

                          <tbody>
                            <tr key={product.id}>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {product.title}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {product.description}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <img
                                  className="w-40 object-cover object-center"
                                  src={product.image}
                                  alt={product.title}
                                />
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {product.price}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <Link href={`/dashboard/products/${product.id}`}>
                                  <Button color="blue" className="items-center gap-3">
                                    <PencilSquareIcon strokeWidth={2} className="h-4 w-4" />
                                  </Button>
                                </Link>

                                <Button color="red" className="items-center gap-3" onClick={() => del(product.id)}>
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
                  <CreateProducts isOpen={isModalOpenCreate} onClose={closeModalCreate} />
                  <NotificationDeleteDialog open={openDialog} handleOpenDelete={handleOpenDialog} handleConfirmDelete={handleConfirmDelete} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterAdmin />
    </Layout>
  );
}

ProductsTable.defaultProps = {
  color: "light",
};
