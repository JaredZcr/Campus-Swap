import React from 'react'
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-columns">
          {/* Shop Column */}
          <div className="footer-column">
            <h3 className="footer-heading">SHOP</h3>
            <ul className="footer-links">
              <li><a href="/textbooks">Textbooks</a></li>
              <li><a href="/electronics">Electronics</a></li>
              <li><a href="/furniture">Furniture</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="footer-column">
            <h3 className="footer-heading">SUPPORT</h3>
            <ul className="footer-links">
              <li><a href="/safety">Safety Tips</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="footer-column">
            <h3 className="footer-heading">COMPANY</h3>
            <ul className="footer-links">
              <li><a href="/about">About</a></li>
              <li><a href="/terms">Terms</a></li>
              <li><a href="/privacy">Privacy</a></li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="footer-column">
            <h3 className="footer-heading">CONNECT</h3>
            <ul className="footer-links">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>© 2026 CampusSwap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;