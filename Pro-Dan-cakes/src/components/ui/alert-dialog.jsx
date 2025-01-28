import React from 'react';

export const AlertDialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export const AlertDialogContent = ({ children }) => {
  return <div className="p-6">{children}</div>;
};

export const AlertDialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

export const AlertDialogTitle = ({ children }) => {
  return <h2 className="text-xl font-semibold text-gray-900">{children}</h2>;
};

export const AlertDialogDescription = ({ children }) => {
  return <p className="text-gray-700">{children}</p>;
};

export const AlertDialogFooter = ({ children }) => {
  return <div className="flex justify-end space-x-4 pt-4 border-t">{children}</div>;
};

export const AlertDialogCancel = ({ children }) => {
  return (
    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
      {children}
    </button>
  );
};

export const AlertDialogAction = ({ children, onClick, className }) => {
  return (
    <button className={`px-4 py-2 rounded-lg ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};
