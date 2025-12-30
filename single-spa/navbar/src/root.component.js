import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";
import { navbarApi } from "./api.js";


export default function Root(props) {
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  
  const searchRef = useRef(null);
  const dropdownRef = useRef(null)
  const BASE_URL = process.env.BFF_URL || "http://localhost:3000";


  const handleNavigation = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Handle Home navigation to show only in-stock products
  const handleHomeNavigation = () => {
    // Dispatch event to show only in-stock products
    window.dispatchEvent(new CustomEvent("showInStockOnly"));
    handleNavigation("/");
  };

  const broadcastSearchQuery = (query) => {
    const event = new CustomEvent("searchProducts", { detail: query });
    window.dispatchEvent(event);
  };

  // Handle Products navigation to show all products
  const handleProductsNavigation = () => {
    // Dispatch event to show all products
    window.dispatchEvent(new CustomEvent("showAllProducts"));
    handleNavigation("/products");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
  const handleClickOutside = (event) => {
    // Close search dropdown
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
    }

    // Close user dropdown
    if (
      userMenuRef.current &&
      !userMenuRef.current.contains(event.target)
    ) {
      setShowUserMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  //handlelogout
const handleLogout = () => {
  // Clear local things
  localStorage.removeItem("authToken");
  setShowUserMenu(false);

  // Hard redirect to your BFF logout (not fetch)
  window.location.href = "http://localhost:3000/auth/logout";
};

  // Search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    window.dispatchEvent(
      new CustomEvent("globalSearch", { detail: searchQuery })
    );
    console.log("Search dispatched:", searchQuery);

    setIsSearching(true);
    setShowDropdown(true);

    try {
      const response = await navbarApi.search(searchQuery);
      console.log('Search response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Search results:', data);
        
        // Handle different response formats
        let products = [];
        if (Array.isArray(data)) {
          products = data;
        } else if (data.products) {
          products = data.products;
        } else if (data.data) {
          products = data.data;
        }
        
        console.log('Processed products:', products);
        setSearchResults(products);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Search failed:', response.status, errorData);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debounce
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
        broadcastSearchQuery(searchQuery);
      } else {
        broadcastSearchQuery("");
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Navigate to product details
  const handleProductClick = (product) => {
    handleNavigation(`/products/${product._id}`);
    setShowDropdown(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Handle search button click
  const handleSearchClick = () => {
    handleSearch();
    broadcastSearchQuery(searchQuery);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      broadcastSearchQuery(searchQuery);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => handleNavigation("/")}>
          <span className="logo-icon"></span>
          <span className="logo-text">ShopMe</span>
        </div>


        {/* Search Bar */}
        <div className="navbar-search" ref={searchRef}>
          <input
            type="text"
            placeholder="Search for fresh fruits & vegetables"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => searchQuery && setShowDropdown(true)}
          />
          <button className="search-button" onClick={handleSearchClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="#" onClick={handleHomeNavigation} className="nav-link">
            Home
          </a>
          <a href="#" onClick={handleProductsNavigation} className="nav-link">
            Products
          </a>
          <a href="" onClick={() => handleNavigation("/products/categories")} className="nav-link">
            Categories
          </a>
          <a href="#" className="nav-link">
            About
          </a>
        </div>


        {/* User Actions */}
        <div className="navbar-actions">
          <button className="action-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
         
          <button
            className="action-button cart-button"
            onClick={() => handleNavigation("/cart")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>


          {/* <button className="action-button profile-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button> */}
          <div className="profile-container" ref={userMenuRef}>
            <button
              className="action-button profile-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <p className="user-greeting">👋 Hi Thasara,<br/>Welcome to ShopMe!</p>

                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>


        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
