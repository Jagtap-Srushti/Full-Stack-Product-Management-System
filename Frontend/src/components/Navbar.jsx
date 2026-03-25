import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";

const Navbar = ({ onSelectCategory }) => {
  const { cart } = useContext(AppContext);

  const getInitialTheme = () => {
    return localStorage.getItem("theme") || "light";
  };

  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  // 🌙 Theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🔍 Search
  const handleChange = async (value) => {
    setInput(value);

    if (value.length > 0) {
      setShowSearchResults(true);
      try {
        const res = await axios.get(
          `http://localhost:8080/api/products/search?keyword=${value}`
        );
        setSearchResults(res.data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  // ❌ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".category-dropdown")) {
        setShowCategories(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () =>
      document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 border-b shadow-sm z-50">
      
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <Link
          to="/"
          className="text-xl font-bold text-black dark:text-white"
        >
          ShopEase
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          
          <Link className="hover:text-blue-500" to="/">
            Home
          </Link>

          <Link className="hover:text-blue-500" to="/add_product">
            Add Product
          </Link>

          {/* CATEGORY DROPDOWN */}
          <div className="relative category-dropdown">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="hover:text-blue-500"
            >
              Categories ▾
            </button>

            {showCategories && (
              <div className="absolute left-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-md rounded-lg border z-50">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onSelectCategory(cat);
                      setShowCategories(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4 relative">

          {/* SEARCH */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              className="w-64 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            />

            {/* SEARCH RESULTS */}
            {showSearchResults && (
              <div className="absolute top-12 left-0 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg max-h-60 overflow-y-auto border z-50">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      onClick={() => setShowSearchResults(false)}
                    >
                      {item.name}
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-500">
                    No results
                  </p>
                )}
              </div>
            )}
          </div>

          {/* CART */}
          <Link to="/cart" className="relative text-xl">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {/* THEME */}
          <button
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="text-xl"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4 border-t">
          
          <Link to="/" className="block py-2">
            Home
          </Link>

          <Link to="/add_product" className="block py-2">
            Add Product
          </Link>

          {/* MOBILE CATEGORY */}
          <div className="mt-2">
            <p className="text-sm font-semibold">Categories</p>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setMenuOpen(false);
                }}
                className="block w-full text-left py-1 text-sm"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* MOBILE SEARCH */}
          <input
            type="text"
            placeholder="Search..."
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full mt-3 px-3 py-2 border rounded-md text-sm"
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
