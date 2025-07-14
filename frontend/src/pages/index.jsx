import React, { useEffect } from 'react';
import './index.css';
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => {
      observer.observe(element);
    });
  }, []);

  return (
    <>
      {/* Header */}
      <header>
        <div className="container">
          <nav className="navbar">
            <a href="#" className="logo"><i className="fas fa-bolt"></i>CampusConnect</a>
            <ul className="nav-links">
              <li><a href="#problem">The Problem</a></li>
              <li><a href="#solution">Our Solution</a></li>
              <li><a href="#marketplace">Marketplace</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
            </ul>
            <div className="nav-cta">
              <a href="#" className="btn btn-secondary">Vendor Login</a>
              <Link to="/login" className="btn btn-primary">Get Started</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text fade-in">
              <h1>The Complete Campus Marketplace</h1>
              <p>Everything students need, delivered in 5 minutes. Food, services, supplies, and more - all from
                trusted campus vendors.</p>
              <div className="hero-cta">
                <a href="#" className="btn btn-primary"><i className="fas fa-download"></i> Download App</a>
                <Link to="/home" className="btn btn-secondary"><i className="fas fa-store"></i> View Products</Link>
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

      {/* Problem Section */}
      <section id="problem" className="problem section">
        <div className="container">
          <h2 className="section-title fade-in">The Campus Struggle is Real</h2>
          <p className="section-subtitle fade-in delay-1">Students waste valuable time on basic tasks instead of focusing
            on their education</p>

          <div className="problem-container">
            <div className="problem-image fade-in">
              <i className="fas fa-clock" style={{ fontSize: '5rem', color: 'var(--primary-light)' }}></i>
            </div>
            <div className="problem-text fade-in delay-1">
              <h3>15+ Hours Wasted Weekly</h3>
              <p>Students spend excessive time walking across campus for food, waiting in laundry queues,
                searching for device repair services, and finding tutors.</p>
              <p>Our research shows the average student loses 15+ hours each week on simple procurement tasks that
                could be streamlined.</p>

              <div className="problem-stats">
                <div className="problem-stat">
                  <div className="problem-stat-number">45min</div>
                  <p>Average time to get basic necessities</p>
                </div>
                <div className="problem-stat">
                  <div className="problem-stat-number">KSh 200+</div>
                  <p>Delivery fees from external platforms</p>
                </div>
                <div className="problem-stat">
                  <div className="problem-stat-number">30-45min</div>
                  <p>Typical delivery time from off-campus</p>
                </div>
                <div className="problem-stat">
                  <div className="problem-stat-number">40%</div>
                  <p>Vendor revenue increase on our platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="solution section">
        <div className="container">
          <h2 className="section-title fade-in">Your Complete Campus Ecosystem</h2>
          <p className="section-subtitle fade-in delay-1">We're not just another delivery app - we're the digital
            infrastructure for campus life</p>

          <div className="solution-grid">
            <div className="solution-card fade-in">
              <div className="solution-icon"><i className="fas fa-bolt"></i></div>
              <h3>5-Minute Delivery</h3>
              <p>Everything is within walking distance on campus, enabling ultra-fast delivery times that external
                platforms can't match.</p>
            </div>
            <div className="solution-card fade-in delay-1">
              <div className="solution-icon"><i className="fas fa-hand-holding-usd"></i></div>
              <h3>Student-Friendly Pricing</h3>
              <p>KSh 50-100 delivery fees designed for student budgets, not corporate profits like external
                delivery services.</p>
            </div>
            <div className="solution-card fade-in delay-2">
              <div className="solution-icon"><i className="fas fa-store"></i></div>
              <h3>Support Local Vendors</h3>
              <p>Direct access to your favorite campus businesses, helping them grow while maintaining their
                personal touch.</p>
            </div>
            <div className="solution-card fade-in delay-3">
              <div className="solution-icon"><i className="fas fa-boxes"></i></div>
              <h3>Everything in One App</h3>
              <p>Food, laundry, repairs, supplies, tutoring - your entire campus marketplace unified in a single
                platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="section">
        <div className="container">
          <h2 className="section-title fade-in">Explore Our Campus Marketplace</h2>
          <p className="section-subtitle fade-in delay-1">Discover fresh products and reliable services from our trusted
            local providers</p>

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
                <a href="#" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>Order
                  Now</a>
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
                <a href="#" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>Shop
                  Now</a>
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
                <a href="#" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>Browse
                  Now</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section">
        <div className="container">
          <h2 className="section-title fade-in">Our Top Services</h2>
          <p className="section-subtitle fade-in delay-1">Essential services designed specifically for campus life</p>

          <div className="services-grid">
            <div className="service-card fade-in">
              <h3>LAUNDRY & HOUSEKEEPING</h3>
              <p>Professional laundry pickup and delivery, plus room cleaning services for busy students. Schedule
                pickups and get notifications when your laundry is ready.</p>
            </div>
            <div className="service-card fade-in delay-1">
              <h3>PHONE & LAPTOP REPAIR</h3>
              <p>Quick and reliable tech repair services by certified professionals on campus. Get diagnostics,
                estimates, and repairs without leaving your dorm.</p>
            </div>
            <div className="service-card fade-in delay-2">
              <h3>TUTORING & ACADEMIC SUPPORT</h3>
              <p>Connect with peer tutors and academic support for all your subjects. Schedule sessions and get
                study materials delivered to your location.</p>
            </div>
            <div className="service-card fade-in delay-3">
              <h3>EVENT PLANNING & SUPPLIES</h3>
              <p>Everything you need for campus events, parties, and gatherings. From catering to equipment
                rental, we've got you covered.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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

      {/* Testimonials Section */}
      <section className="testimonials section">
        <div className="container">
          <h2 className="section-title fade-in">What Our Community Says</h2>
          <p className="section-subtitle fade-in delay-1">Hear from students and vendors using CampusConnect</p>

          <div className="testimonial-grid">
            <div className="testimonial-card fade-in">
              <div className="testimonial-header">
                <div className="testimonial-avatar">JK</div>
                <div>
                  <div className="testimonial-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <h4>James K.</h4>
                  <small>3rd Year Engineering</small>
                </div>
              </div>
              <p>"I've saved at least 10 hours a week since using CampusConnect. Now I can focus on my studies
                while still getting everything I need delivered to my dorm."</p>
            </div>

            <div className="testimonial-card fade-in delay-1">
              <div className="testimonial-header">
                <div className="testimonial-avatar">SM</div>
                <div>
                  <div className="testimonial-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <h4>Sarah M.</h4>
                  <small>Campus Café Owner</small>
                </div>
              </div>
              <p>"Our revenue has increased by 45% since joining CampusConnect. The platform handles all the
                delivery logistics so we can focus on making great food."</p>
            </div>

            <div className="testimonial-card fade-in delay-2">
              <div className="testimonial-header">
                <div className="testimonial-avatar">DN</div>
                <div>
                  <div className="testimonial-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                  <h4>David N.</h4>
                  <small>Delivery Partner</small>
                </div>
              </div>
              <p>"As a student, this is the perfect part-time job. Flexible hours, good pay, and I get to help my
                fellow students while earning money."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="fade-in">Ready to Transform Your Campus Life?</h2>
            <p className="fade-in delay-1">Join thousands of students who've already discovered the convenience of
              CampusConnect</p>
            <div className="cta-buttons fade-in delay-2">
              <a href="#" className="btn btn-primary"><i className="fas fa-download"></i> Download App</a>
              <a href="#" className="btn btn-secondary"><i className="fas fa-store"></i> Vendor Sign Up</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </>
  );
};

export default Index;
