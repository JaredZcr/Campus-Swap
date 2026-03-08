import React from 'react';
import './Hero.css';

export function Hero() {
  return (
    <div className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1 className="hero__title"
          >
            <span className="hero__title-line">Buy & Sell on Campus</span>
            <span className="hero__title-line hero__title-line--accent">Safe. Easy. Local.</span>
          </h1>

          <p className="hero__subtitle">
            The trusted marketplace for university students.
          </p>
        </div>
      </div>
    </div>
  );
}