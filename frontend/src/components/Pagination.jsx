import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  // Generate page numbers with ellipsis for large page sets
  const maxPageNumbersToShow = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) {
    startPage = 1;
    endPage = Math.min(totalPages, maxPageNumbersToShow);
  } else if (currentPage + 2 >= totalPages) {
    startPage = Math.max(1, totalPages - (maxPageNumbersToShow - 1));
    endPage = totalPages;
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center items-center mt-6 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
      >
        {'<'}
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-200"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 rounded border border-gray-300 hover:bg-yellow-400 hover:text-white ${
            number === currentPage ? "bg-yellow-400 text-white" : "text-gray-600"
          }`}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-200"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
      >
        {'>'}
      </button>
    </nav>
  );
};

export default Pagination;
