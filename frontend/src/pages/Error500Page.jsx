import React from "react";
import CustomFooter from "../components/CustomFooter";

const Error500Page = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-gray-700">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Illustration */}
          <div className="flex-shrink-0">
            <svg
              width="150"
              height="150"
              viewBox="0 0 150 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="30" y="30" width="90" height="90" rx="10" fill="#A3BFFA" />
              <circle cx="60" cy="60" r="10" fill="#1E40AF" />
              <circle cx="90" cy="60" r="10" fill="#1E40AF" />
              <rect x="50" y="90" width="50" height="10" rx="2" fill="#1E40AF" />
              <path
                d="M30 30L20 20M120 30L130 20M30 120L20 130M120 120L130 130"
                stroke="#4B5563"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M40 40L20 60M110 40L130 60M40 110L20 90M110 110L130 90"
                stroke="#F97316"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">Internal Server Error</h1>
            <h2 className="text-lg font-semibold mb-4">Error 500</h2>
            <p className="mb-4">
              This could be due to one of the following reasons:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-500">
              <li>.htaccess file was misconfigured</li>
              <li>Permissions for the file requested on site were misconfigured</li>
              <li>PHP or CGI code was misconfigured in the file that is requested on site</li>
              <li>Site resources are approaching their maximum limits</li>
            </ul>
            <p className="mb-2">
              Please contact the server administrator{" "}
              <a href="mailto:webmaster@quicklend.website" className="text-red-600 underline">
                webmaster@quicklend.website
              </a>{" "}
              and provide the following information:
            </p>
            <ul className="list-disc list-inside text-gray-500">
              <li>The time the error occurred</li>
              <li>
                The actions you took prior to and immediately following the error. This will help the administrator better understand what may have caused the error. Please refer to the server error log for more information.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <CustomFooter />
    </>
  );
};

export default Error500Page;
