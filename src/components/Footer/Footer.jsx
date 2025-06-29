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
          Home
        </Link>
        <a className="link link-hover">About Us</a>
        <a className="link link-hover">Contact</a>
      </nav>

      <aside className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
        <p className="font-bold">
          Travel4Real © {currentYear} All rights reserved
        </p>
      </aside>

      <nav className="flex flex-row gap-4 w-full md:w-auto justify-center md:justify-end">
        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-current"
          >
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
          </svg>
        </a>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-current"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.774 1.632 4.906 4.906.058 1.267.07 1.647.07 4.85s-.012 3.584-.07 4.85c-.132 3.252-1.616 4.774-4.906 4.906-1.267.058-1.647.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.132-4.774-1.616-4.906-4.906-.058-1.267-.07-1.647-.07-4.85s.012-3.584.07-4.85c.132-3.252 1.616-4.774 4.906-4.906 1.267-.058 1.647-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.354.21-6.793 2.618-7.005 7.005-.058 1.28-.072 1.689-.072 4.947s.014 3.667.072 4.947c.21 4.354 2.618 6.793 7.005 7.005 1.28.058 1.689.072 4.947.072s3.667-.014 4.947-.072c4.354-.21 6.793-2.618 7.005-7.005.058-1.28.072-1.689.072-4.947s-.014-3.667-.072-4.947c-.21-4.354-2.618-6.793-7.005-7.005-1.28-.058-1.689-.072-4.947-.072zm0 6.07c-3.259 0-5.879 2.62-5.879 5.879s2.62 5.879 5.879 5.879 5.879-2.62 5.879-5.879-2.62-5.879-5.879-5.879zm0 9.679c-2.106 0-3.809-1.703-3.809-3.809s1.703-3.809 3.809-3.809 3.809 1.703 3.809 3.809-1.703 3.809-3.809 3.809zm6.264-10.233c-.702 0-1.272.57-1.272 1.271s.57 1.271 1.272 1.271 1.271-.57 1.271-1.271-.57-1.271-1.271-1.271z"></path>
          </svg>
        </a>
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-current"
          >
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
          </svg>
        </a>
      </nav>
    </footer>
  );
}
