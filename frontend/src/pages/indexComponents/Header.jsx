import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo"><i className="fas fa-bolt"></i>CampusConnect</Link>
          <ul className="nav-links">
            <li><a href="#problem">The Problem</a></li>
            <li><a href="#solution">Our Solution</a></li>
            <li><a href="#marketplace">Marketplace</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
          </ul>
          <div className="nav-cta">
            <Link to="/login" className="btn btn-secondary">Vendor Login</Link>
            <Link to="/home" className="btn btn-primary">Get started</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
