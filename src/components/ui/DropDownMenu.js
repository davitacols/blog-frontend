// src/components/ui/dropdown-menu.js

import React from 'react';

const DropdownMenu = ({ children }) => {
  return (
    <div className="relative inline-block text-left">
      {children}
    </div>
  );
};

const DropdownMenuTrigger = ({ children }) => {
  return <button className="flex items-center">{children}</button>;
};

const DropdownMenuContent = ({ children, align }) => {
  return (
    <div
      className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ${align}`}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      {children}
    </button>
  );
};

const DropdownMenuSeparator = () => {
  return <div className="border-t border-gray-200" />;
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
