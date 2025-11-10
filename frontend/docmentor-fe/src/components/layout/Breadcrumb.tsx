import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string | null;
  icon?: boolean; // Nếu true thì hiện icon Home
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 lg:px-8 py-3 mt-4 rounded-t-lg shadow-sm">
      <nav className="flex items-center text-sm">
        {items.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}

            {crumb.path ? (
              <Link
                to={crumb.path}
                className="flex items-center text-gray-600 hover:text-primary transition-colors"
              >
                {crumb.icon && <Home className="w-4 h-4 mr-1" />}
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium flex items-center">
                {crumb.icon && <Home className="w-4 h-4 mr-1" />}
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Breadcrumb;
