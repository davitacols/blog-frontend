// src/components/ui/Sheet.js

import React from 'react';

const Sheet = ({ children }) => {
  return (
    <div className="fixed inset-0 z-40 bg-black/50">
      <div className="absolute top-0 right-0 w-full max-w-md bg-white h-full">
        {children}
      </div>
    </div>
  );
};

const SheetContent = ({ children, className }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

const SheetTrigger = ({ children }) => {
  return <div>{children}</div>;
};

export { Sheet, SheetContent, SheetTrigger };
