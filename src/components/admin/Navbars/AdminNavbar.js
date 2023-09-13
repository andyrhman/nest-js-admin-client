import React from "react";
import { connect } from "react-redux";
import UserDropdown from "@/components/Dropdowns/UserDropdown.js";

const Navbar = (props) => {

  return (
    <>
      <nav className="absolute top-0 left-0 w-full z-10 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
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
              {props.user && props.user.username}
            </a>
            <UserDropdown />
          </ul>
        </div>
      </nav>
    </>
  );
}
// * https://www.phind.com/search?cache=yh923hlxiaeeipq2fv0952d1
export default connect(
  (state) => {
    return {
      user: state.user.user
    }
  }
)(Navbar);