import React from 'react';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-fatal-light rounded-fatal shadow-fatal p-6 border-2 border-fatal-red">
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout; 