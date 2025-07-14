import React from 'react';

const ServicesSection = () => {
  return (
    <section id="services" className="section">
      <div className="container">
        <h2 className="section-title fade-in">Our Top Services</h2>
        <p className="section-subtitle fade-in delay-1">Essential services designed specifically for campus life</p>

        <div className="services-grid">
          <div className="service-card fade-in">
            <h3>LAUNDRY & HOUSEKEEPING</h3>
            <p>Professional laundry pickup and delivery, plus room cleaning services for busy students. Schedule pickups and get notifications when your laundry is ready.</p>
          </div>
          <div className="service-card fade-in delay-1">
            <h3>PHONE & LAPTOP REPAIR</h3>
            <p>Quick and reliable tech repair services by certified professionals on campus. Get diagnostics, estimates, and repairs without leaving your dorm.</p>
          </div>
          <div className="service-card fade-in delay-2">
            <h3>TUTORING & ACADEMIC SUPPORT</h3>
            <p>Connect with peer tutors and academic support for all your subjects. Schedule sessions and get study materials delivered to your location.</p>
          </div>
          <div className="service-card fade-in delay-3">
            <h3>EVENT PLANNING & SUPPLIES</h3>
            <p>Everything you need for campus events, parties, and gatherings. From catering to equipment rental, we've got you covered.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
