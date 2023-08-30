import React, { useEffect, useState } from "react";
import UserDropdown from "@/components/Dropdowns/UserDropdown.js";
import { useRouter } from "next/router";
import axios from "axios";

const Navbar = () => {
  // Getting the user data
  const [user, setUser] = useState('');
  // Redirect if user not authenticated
  const router = useRouter();

  const [error, setError] = useState('');
  useEffect(() => {

    (
      async () => {
        try {
          const { data } = await axios.get('user');
          setUser(data);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            setError('Authentication Error');
            // Handle authentication error here
          } else {
            setError('An error occurred');
            console.log(error);
          }
        }
      }
    )();

  }, [])


  return (
    <>
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            Dashboard
          </a>
          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            {/* Brand */}
            <a
              className="text-white text-sm uppercase font-semibold"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              {user.username}
            </a>
            <UserDropdown />
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;