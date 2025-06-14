import React, { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { Link } from "react-router-dom";
import { fetchBikes } from "../slices/bikeSlice";
import { Menu, Transition } from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import { Element } from "react-scroll";

const categories = [
  "Sport",
  "Cruiser",
  "Adventure",
  "Touring",
  "Naked",
  "Dual Sport",
];

const BikeListPage: React.FC = () => {
  const { bikes, loading, error } = useSelector(
    (state: RootState) => state.bikes
  );
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    // Scroll to categories section if there's a hash in the URL
    const hash = window.location.hash;
    if (hash === "#categories") {
      const element = document.getElementById("categories");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }

    dispatch(fetchBikes({}) as any);
  }, [dispatch]);

  return (
    <Element name="categories" id="categories" className="pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Section */}
        <form className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search motorcycles..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
              <TagIcon className="h-5 w-5" />
              {category || "Categories"}
              <ChevronDownIcon className="h-4 w-4" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-in"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0">
              <Menu.Items className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-200 focus:outline-none z-10">
                <div className="p-2">
                  {categories.map((cat) => (
                    <Menu.Item key={cat}>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            setCategory(cat);
                            dispatch(
                              fetchBikes({ category: cat, sortBy: sort }) as any
                            );
                          }}
                          className={`${
                            active
                              ? "bg-gray-50 text-gray-900"
                              : "text-gray-700"
                          } group flex w-full items-center rounded-lg px-3 py-2 text-sm`}>
                          {cat}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </form>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Motorcycles
          </h2>
          <p className="text-gray-600">Showing {bikes.length} bikes</p>
        </div>

        {/* Bikes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikes.map((bike) => (
            <div
              key={bike._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={bike.images[0] || "/placeholder.jpg"}
                  alt={bike.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {bike.title}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">
                    {bike.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${bike.price.toLocaleString()}
                  </span>
                  <Link
                    to={`/bikes/${bike._id}`}
                    className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 group">
                    View Details
                    <ArrowLongRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Element>
  );
};

export default BikeListPage;
