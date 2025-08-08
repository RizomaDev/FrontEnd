import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="footer items-center justify-between text-base-content p-4 flex flex-col gap-y-2 md:flex-row md:gap-x-4"
      style={{ backgroundColor: "#B3C7BB" }}
    >
      <nav className="flex flex-row gap-4 justify-center w-full md:w-auto">
        <Link to="/HomePage" className="link link-hover">
          Inicio
        </Link>
        <Link to="/MapView" className="link link-hover">
          Mapa
        </Link>
        <Link to="/Contact" className="link link-hover">
          Contacto
        </Link>
      </nav>

      <aside className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
        <p className="font-bold">
          Otra Málaga © {currentYear}
        </p>
      </aside>

      <nav className="flex flex-row gap-4 w-full md:w-auto justify-center md:justify-end">
        <Link 
          to="/Terms" 
          className="link link-hover flex items-center gap-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <line x1="10" y1="9" x2="8" y2="9"/>
          </svg>
          Términos de uso
        </Link>
      </nav>
    </footer>
  );
}
