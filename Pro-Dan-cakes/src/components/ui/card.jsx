import React from 'react';

// Card Component
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

// CardHeader Component
const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`p-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

// CardTitle Component
const CardTitle = ({ children, className = '' }) => {
  return (
    <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
};

// CardContent Component
const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent };
