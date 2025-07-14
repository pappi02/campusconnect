import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text fade-in">
            <h1>The Complete Campus Marketplace</h1>
            <p>Everything students need, delivered in 5 minutes. Food, services, supplies, and more - all from trusted campus vendors.</p>
            <div className="hero-cta">
              <a href="#" className="btn btn-primary"><i className="fas fa-download"></i> Download App</a>
              <a href="#" className="btn btn-secondary"><i className="fas fa-store"></i> Login</a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-icon"><i className="fas fa-users"></i></div>
                <div>
                  <div className="stat-number">5,000+</div>
                  <div className="stat-label">Active Students</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon"><i className="fas fa-store"></i></div>
                <div>
                  <div className="stat-number">30+</div>
                  <div className="stat-label">Campus Vendors</div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-image fade-in delay-1">
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="app-header">CampusConnect</div>
                <div className="app-content">
                  <div className="app-category">
                    <i className="fas fa-utensils"></i>
                    <span>Food & Drinks</span>
                  </div>
                  <div className="app-category">
                    <i className="fas fa-tshirt"></i>
                    <span>Laundry Service</span>
                  </div>
                  <div className="app-category">
                    <i className="fas fa-laptop"></i>
                    <span>Tech Repairs</span>
                  </div>
                  <div className="app-category">
                    <i className="fas fa-book"></i>
                    <span>Study Materials</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
