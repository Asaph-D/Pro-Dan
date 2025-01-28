import React from 'react';

export const Alert = ({ variant, children, className }) => {
  const variantClasses = {
    destructive: 'bg-red-100 text-red-700',
    // Add other variants as needed
  };

  return (
    <div className={`p-4 rounded-lg ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children }) => {
  return <div className="text-sm">{children}</div>;
};
