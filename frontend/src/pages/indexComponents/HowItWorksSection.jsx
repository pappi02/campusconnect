import React from 'react';

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <h2 className="section-title fade-in">How CampusConnect Works</h2>
        <p className="section-subtitle fade-in delay-1">Getting what you need is as easy as 1-2-3-4</p>

        <div className="steps">
          <div className="step fade-in">
            <div className="step-number">1</div>
            <h3>Browse & Select</h3>
            <p>Choose from hundreds of products and services from local campus vendors</p>
          </div>
          <div className="step fade-in delay-1">
            <div className="step-number">2</div>
            <h3>Place Order</h3>
            <p>Add to cart and pay securely using M-Pesa or other payment methods</p>
          </div>
          <div className="step fade-in delay-2">
            <div className="step-number">3</div>
            <h3>Track Delivery</h3>
            <p>Follow your order in real-time as it's prepared and delivered by fellow students</p>
          </div>
          <div className="step fade-in delay-3">
            <div className="step-number">4</div>
            <h3>Enjoy & Rate</h3>
            <p>Receive your order in minutes and rate your experience to help improve our service</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
