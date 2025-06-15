import React, { useState, useEffect, Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { logout } from "../slices/authSlice";
import { twMerge } from "tailwind-merge";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";

const Navbar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const scrollToCategories = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("categories");
    if (element) {
      if (location.pathname !== "/") {
        navigate("/");
        // Wait for navigation to complete before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const StyledNavLink = ({
    to,
    children,
    onClick,
  }: {
    to: string;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
  }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClick}
        className={twMerge(
          "px-3 py-2 text-sm font-medium rounded-xl transition-colors",
          isActive
            ? "text-primary-600 bg-primary-50/90"
            : "text-gray-700 hover:text-primary-600 hover:bg-primary-50/60"
        )}>
        {children}
      </Link>
    );
  };

  return (
    <nav
      className={twMerge(
        "fixed top-0 w-full transition-all duration-300 z-50",
        scrolled || !["/", "/bikes"].includes(location.pathname)
          ? "bg-white shadow-md text-gray-800"
          : "bg-transparent text-white"
      )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold">MotoShop</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={twMerge(
                "hover:text-primary-500 transition-colors",
                location.pathname === "/" && "text-primary-500"
              )}>
              Home
            </Link>
            <Link
              to="/bikes"
              className={twMerge(
                "hover:text-primary-500 transition-colors",
                location.pathname === "/bikes" && "text-primary-500"
              )}>
              Motorcycles
            </Link>
            <Link
              to="/support"
              className={twMerge(
                "hover:text-primary-500 transition-colors",
                location.pathname === "/support" && "text-primary-500"
              )}>
              Support
            </Link>
            <Link
              to="/about"
              className={twMerge(
                "hover:text-primary-500 transition-colors",
                location.pathname === "/about" && "text-primary-500"
              )}>
              About
            </Link>
            <Link
              to="/contact"
              className={twMerge(
                "hover:text-primary-500 transition-colors",
                location.pathname === "/contact" && "text-primary-500"
              )}>
              Contact
            </Link>
            {user ? (
              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex items-center space-x-2 hover:opacity-80">
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95">
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {user.role === "admin" && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/admin"
                            className={twMerge(
                              "block px-4 py-2 text-sm font-bold text-gray-700",
                              active && "bg-gray-100 rounded-t-xl"
                            )}>
                            Admin Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={twMerge(
                            "block w-full text-center px-4 py-2 text-sm text-white bg-red-500",
                            active && "bg-gray-100",
                            !user.role && "rounded-t-xl",
                            "rounded-b-xl"
                          )}>
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                to="/login"
                className={twMerge(
                  "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl transition-all",
                  scrolled || location.pathname !== "/"
                    ? "text-white bg-primary-600 hover:bg-primary-700"
                    : "text-primary-600 bg-white hover:bg-white/90"
                )}>
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={twMerge(
                "inline-flex items-center justify-center p-2 rounded-md transition-colors",
                scrolled || location.pathname !== "/" || isOpen
                  ? "text-gray-700 hover:text-gray-900"
                  : "text-white hover:text-white"
              )}>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={twMerge(
          "md:hidden transition-all duration-300 ease-in-out",
          isOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        )}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-xl border-t border-gray-200/20">
          <MobileNavLink to="/" onClick={() => setIsOpen(false)}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/bikes" onClick={() => setIsOpen(false)}>
            Motorcycles
          </MobileNavLink>
          <MobileNavLink to="/support" onClick={() => setIsOpen(false)}>
            Support
          </MobileNavLink>
          <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>
            About
          </MobileNavLink>
          <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </MobileNavLink>
          {!user && (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-3 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700">
              Sign in
            </Link>
          )}
          {user && (
            <>
              {user.role === "admin" && (
                <MobileNavLink to="/admin" onClick={() => setIsOpen(false)}>
                  <span className="font-bold">Admin Dashboard</span>
                </MobileNavLink>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full px-3 py-2 rounded-md bg-red-600 text-white text-center">
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const MobileNavLink: React.FC<{
  to: string;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ to, onClick, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={twMerge(
        "block px-3 py-2 rounded-md text-base font-medium",
        isActive
          ? "text-primary-600 bg-primary-50"
          : "text-gray-700 hover:text-primary-600 hover:bg-primary-50"
      )}>
      {children}
    </Link>
  );
};

export default Navbar;
