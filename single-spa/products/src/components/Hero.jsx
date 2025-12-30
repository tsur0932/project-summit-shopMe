import React from "react";


export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Fresh Fruits & Vegetables</h1>
        <p>Farm-fresh produce delivered to your doorstep</p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">500+</span>
            <span className="stat-label">Fresh Products</span>
          </div>
          <div className="stat">
            <span className="stat-number">100%</span>
            <span className="stat-label">Organic Options</span>
          </div>
          <div className="stat">
            <span className="stat-number">24h</span>
            <span className="stat-label">Fresh Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}






