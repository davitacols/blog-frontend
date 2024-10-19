import React from 'react';
import './NotFound.css';

export default function NotFound404() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="inline-flex justify-center w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-indigo-600 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01"></path>
          </svg>
        </div>
        <div>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            404 - Page Not Found
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            The page you are looking for does not exist.
          </p>
        </div>
        <div className="mt-10">
          <a
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  );
}
