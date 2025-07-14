import React from 'react';

const MarketplaceSection = () => {
  return (
    <section id="marketplace" className="section">
      <div className="container">
        <h2 className="section-title fade-in">Explore Our Campus Marketplace</h2>
        <p className="section-subtitle fade-in delay-1">Discover fresh products and reliable services from our trusted local providers</p>

        <div className="marketplace-categories">
          <div className="category-card fade-in">
            <div className="category-header">
              <i className="fas fa-utensils"></i>
            </div>
            <div className="category-body">
              <h3>Food & Beverages</h3>
              <p>Fresh meals, snacks, and drinks from your favorite campus eateries</p>
              <div className="category-items">
                <span className="category-item">Dairy Products</span>
                <span className="category-item">Bakery Items</span>
                <span className="category-item">Beverages</span>
                <span className="category-item">Snacks</span>
              </div>
              <a href="#" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>Order Now</a>
            </div>
          </div>

          <div className="category-card fade-in delay-1">
            <div className="category-header">
              <i className="fas fa-tshirt"></i>
            </div>
            <div className="category-body">
              <h3>Fashion & Clothing</h3>
              <p>Stylish apparel and accessories for campus life</p>
              <div className="category-items">
                <span className="category-item">Men's Clothing</span>
                <span className="category-item">Women's Clothing</span>
                <span className="category-item">Accessories</span>
                <span className="category-item">Footwear</span>
              </div>
              <a href="#" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>Shop Now</a>
            </div>
          </div>

          <div className="category-card fade-in delay-2">
            <div className="category-header">
              <i className="fas fa-laptop"></i>
            </div>
            <div className="category-body">
              <h3>Electronics & Services</h3>
              <p>Tech essentials and repair services for your devices</p>
              <div className="category-items">
                <span className="category-item">Mobile Phones</span>
                <span className="category-item">Repairs</span>
                <span className="category-item">Accessories</span>
                <span className="category-item">Home Appliances</span>
              </div>
              <a href="#" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>Browse Now</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
