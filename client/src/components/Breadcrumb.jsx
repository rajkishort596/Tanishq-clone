import React from "react";
import { Link } from "react-router-dom";

/**
 * Breadcrumb component
 * @param {Array<{ label: string, to?: string }>} items - Breadcrumb items
 * @param {string} className - Additional classes for the wrapper
 */
const Breadcrumb = ({ items = [], className = "" }) => {
  return (
    <div
      className={`hidden px-4 md:flex gap-2 items-center w-full text-sm text-gray-500 bg-white pt-10 ${className}`}
    >
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span>&gt;</span>}
          {item.to && idx !== items.length - 1 ? (
            <Link
              to={item.to}
              className="text-primary font-medium font-IBM-Plex"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-primary font-medium font-IBM-Plex">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
