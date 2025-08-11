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
          Otra Málaga
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
            {"Iniciar sesión"}
          </Buttons>
          <Buttons to="/Register" color="btn-primary [filter:sepia(40%)]">
            {"Registrarse"}
          </Buttons>
        </div>
        <div className="md:hidden flex items-center gap-2 mr-4">
          <Link to="/Login" className="btn btn-ghost text-base-content">
            Iniciar sesión
          </Link>
          <Link to="/Register" className="btn btn-primary [filter:sepia(40%)]">
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
