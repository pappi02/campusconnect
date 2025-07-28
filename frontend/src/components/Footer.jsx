import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <div className="footer-logo"><i className="fas fa-bolt"></i>CampusConnect</div>
            <p>The complete campus marketplace connecting students with local vendors and services.</p>
            <div className="social-links">
              <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <div className="deliver-for-us-section" style={{ marginTop: '20px' }}>
              <Link 
                to="/delivery/how-it-works" 
                className="deliver-for-us-btn"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#fbbf24',
                  color: '#000',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f59e0b';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#fbbf24';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <i className="fas fa-truck" style={{ marginRight: '8px' }}></i>
                Deliver for Us
              </Link>
            </div>
          </div>

          <div className="footer-links">
            <h3>For Students</h3>
            <ul>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Download App</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contact Support</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3>For Vendors</h3>
            <ul>
              <li><a href="#">Vendor Benefits</a></li>
              <li><a href="#">Sign Up Process</a></li>
              <li><a href="#">Vendor Dashboard</a></li>
              <li><a href="#">Pricing & Fees</a></li>
              <li><a href="#">Vendor Support</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3>Company</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Our Team</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 CampusConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
