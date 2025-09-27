import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
        {title}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1">
        An overview of the EV population dataset.
      </p>
    </header>
  );
};

export default Header;