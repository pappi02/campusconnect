import React from 'react';

const ProblemSection = () => {
  return (
    <section id="problem" className="problem section">
      <div className="container">
        <h2 className="section-title fade-in">The Campus Struggle is Real</h2>
        <p className="section-subtitle fade-in delay-1">Students waste valuable time on basic tasks instead of focusing on their education</p>

        <div className="problem-container">
          <div className="problem-image fade-in">
            <i className="fas fa-clock" style={{ fontSize: '5rem', color: 'var(--primary-light)' }}></i>
          </div>
          <div className="problem-text fade-in delay-1">
            <h3>15+ Hours Wasted Weekly</h3>
            <p>Students spend excessive time walking across campus for food, waiting in laundry queues, searching for device repair services, and finding tutors.</p>
            <p>Our research shows the average student loses 15+ hours each week on simple procurement tasks that could be streamlined.</p>

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
  );
};

export default ProblemSection;
