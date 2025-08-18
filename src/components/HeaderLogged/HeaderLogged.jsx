import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../index.css";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { searchBookmarks } from "../../service/apiService";


export default function HeaderLogged() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const fetchBookmarks = useCallback(
    async (currentSearchTerm) => {
      if (!currentSearchTerm || currentSearchTerm.trim().length < 2) {
        setBookmarks([]);
        setMessage(
          currentSearchTerm.trim().length > 0
            ? "Type at least 2 characters"
            : ""
        );
        setLoading(false);
        setError(null);
        setDropdownOpen(false);
        return;
      }

      setLoading(true);
      setError(null);
      setMessage("");
      setDropdownOpen(true);

      try {
        const response = await searchBookmarks(currentSearchTerm);
        if (response && response.length > 0) {
          setBookmarks(response);
          setMessage("");
        } else {
          setBookmarks([]);
          setMessage(`No bookmarks found for "${currentSearchTerm}".`);
        }
      } catch (err) {
        if (err.response && err.response.status === 204) {
          setBookmarks([]);
          setMessage(`No bookmarks found for "${currentSearchTerm}".`);
        } else if (
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          setError(`Error: ${err.response.data.message}`);
        } else {
          setError("An unexpected error occurred while searching bookmarks.");
        }
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const debouncedFetchBookmarks = useRef(
    debounce((nextSearchTerm) => {
      fetchBookmarks(nextSearchTerm);
    }, 500)
  ).current;

  useEffect(() => {
    debouncedFetchBookmarks(searchTerm);

    return () => {
      debouncedFetchBookmarks.cancel();
    };
  }, [searchTerm, debouncedFetchBookmarks]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    if (event.target.value.trim().length > 0) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
      setBookmarks([]);
      setMessage("");
      setError(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    if (
      searchTerm.trim().length >= 2 ||
      (searchTerm.trim().length > 0 && (message || bookmarks.length > 0))
    ) {
      setDropdownOpen(true);
    } else if (searchTerm.trim().length === 0) {
      setDropdownOpen(false);
    }
  };

  const handleResultClick = (bookmark) => {
    setDropdownOpen(false);
    setSearchTerm(bookmark.title);
    navigate(`/BookmarkDetails/${bookmark.id}`);
  };

  const onClick = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar bg-secondary shadow-sm flex-wrap">
      <div className="flex-1 md:order-first">
        <Link
          to="/HomePage"
          className="btn btn-ghost text-3xl text-white font-sans normal-case ml-4"
        >
          Otra Málaga
        </Link>
      </div>

      <div className="flex-none flex items-center md:order-last">
        <div className="flex items-center mr-4">
          <div className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User Avatar" src="https://cdn-icons-png.flaticon.com/512/147/147137.png"  />
            </div>
          </div>
        </div>
        <div className="flex-1 md:order-first">

        </div>

        <div className="dropdown dropdown-end relative">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-square btn-ghost"
            onClick={() => setDropdownOpen((open) => !open)}
          >
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
          {true && (
            <ul
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[2000] mt-3 p-2 shadow min-w-max absolute right-0"
            >
              <li>
                <Link to="/HomePage">Inicio</Link>
              </li>
              <li>
                <Link to="/AddBookmark">Añadir marcador</Link>
              </li>
              <li>
                <Link to="/MyBookmark">Mis marcadores</Link>
              </li>
              <li>
                <button onClick={onClick}>Cerrar sesión</button>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div
        className="flex items-center mx-4 my-2 flex-grow w-full md:w-auto md:my-0 md:order-none relative"
        ref={dropdownRef}
      >
        <label className="input input-bordered flex-grow border-r-0">
          <svg
            className="h-5 w-5 opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <input
            ref={inputRef}
            type="search"
            required
            value={searchTerm}
            placeholder="🔖 Buscar marcadores..."
            className="w-full"
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
          />
        </label>

        {dropdownOpen && (
          <ul className="dropdown-content z-[9999] menu p-2 shadow bg-base-100 rounded-box w-full absolute top-full left-0 mt-1">
            {loading && searchTerm.trim().length >= 2 && (
              <li>
                <span className="text-info">Buscando marcadores...</span>
              </li>
            )}
            {!loading && error && searchTerm.trim().length >= 2 && (
              <li>
                <span className="text-error">{error}</span>
              </li>
            )}
            {!loading && message && searchTerm.trim().length >= 2 && (
              <li>
                <span className="text-error">{message}</span>
              </li>
            )}
            {bookmarks.length > 0 && !loading && !error && !message && (
              <>
                {bookmarks.map((bookmark) => (
                  <li key={bookmark.id}>
                    <a onClick={() => handleResultClick(bookmark)}>
                      🔖 {bookmark.title}
                      <span className="text-xs text-gray-500 ml-2 truncate">
                        {bookmark.description}
                      </span>
                    </a>
                  </li>
                ))}
              </>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}