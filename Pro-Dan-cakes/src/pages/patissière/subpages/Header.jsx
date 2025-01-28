import React from 'react';

const Header = ({ title }) => (
  <header className="bg-white text-black-500 py-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  </header>
);

export default Header;
