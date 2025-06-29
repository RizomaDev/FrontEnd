import "../../index.css";
import { Link } from "react-router-dom";

import Buttons from "../Buttons/Buttons";


function Header() {
  return (
    <div className="navbar bg-secondary shadow-sm">
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost text-3xl text-white font-sans normal-case ml-4"
        >
          Travel4Real
        </Link>
      </div>
      <div className="flex-none flex items-center">
        <div className="hidden md:flex items-center gap-5 mr-5">
          <Buttons
            to="/Login"
            className="border-none"
            style={{
              backgroundColor: "oklch(0.9632 0.0152 83.05 / 0.5)",
              color: "var(--color-base-content)",
            }}
          >
            {"Login"}
          </Buttons>
          <Buttons to="/Register" color="btn-primary [filter:sepia(40%)]">
            {"Register"}
          </Buttons>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block h-5 w-5 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="md:hidden menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 p-2 shadow min-w-max"
          >

            <li className="md:hidden">
              <a>Login</a>
            </li>
            <li className="md:hidden">
              <a>Register</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
