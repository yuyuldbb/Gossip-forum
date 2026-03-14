import React from 'react';

interface NavbarProps {
  currentUser: string;
  onLogout: () => void;
  onBackToTopics: () => void;
  showBackButton: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentUser, 
  onLogout, 
  onBackToTopics, 
  showBackButton 
}) => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        {showBackButton && (
          <button onClick={onBackToTopics} className="back-button">
            ← Back to Topics
          </button>
        )}
      </div>
      <div className="nav-right">
        <span className="user-info">Logged in as: {currentUser}</span>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;