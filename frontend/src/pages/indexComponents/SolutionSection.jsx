import React from 'react';

const SolutionSection = () => {
  return (
    <section id="solution" className="solution section">
      <div className="container">
        <h2 className="section-title fade-in">Your Complete Campus Ecosystem</h2>
        <p className="section-subtitle fade-in delay-1">We're not just another delivery app - we're the digital infrastructure for campus life</p>

        <div className="solution-grid">
          <div className="solution-card fade-in">
            <div className="solution-icon"><i className="fas fa-bolt"></i></div>
            <h3>5-Minute Delivery</h3>
            <p>Everything is within walking distance on campus, enabling ultra-fast delivery times that external platforms can't match.</p>
          </div>
          <div className="solution-card fade-in delay-1">
            <div className="solution-icon"><i className="fas fa-hand-holding-usd"></i></div>
            <h3>Student-Friendly Pricing</h3>
            <p>KSh 50-100 delivery fees designed for student budgets, not corporate profits like external delivery services.</p>
          </div>
          <div className="solution-card fade-in delay-2">
            <div className="solution-icon"><i className="fas fa-store"></i></div>
            <h3>Support Local Vendors</h3>
            <p>Direct access to your favorite campus businesses, helping them grow while maintaining their personal touch.</p>
          </div>
          <div className="solution-card fade-in delay-3">
            <div className="solution-icon"><i className="fas fa-boxes"></i></div>
            <h3>Everything in One App</h3>
            <p>Food, laundry, repairs, supplies, tutoring - your entire campus marketplace unified in a single platform.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
