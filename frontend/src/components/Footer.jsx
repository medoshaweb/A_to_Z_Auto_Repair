import React from 'react';
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn, FaFacebookF, FaGooglePlusG } from "react-icons/fa";
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-contact-item">
            <svg
              className="footer-icon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 0C6.48 0 3.5 2.98 3.5 6.5C3.5 11.28 10 20 10 20C10 20 16.5 11.28 16.5 6.5C16.5 2.98 13.52 0 10 0ZM10 8.75C8.76 8.75 7.75 7.74 7.75 6.5C7.75 5.26 8.76 4.25 10 4.25C11.24 4.25 12.25 5.26 12.25 6.5C12.25 7.74 11.24 8.75 10 8.75Z"
                fill="#DC143C"
              />
            </svg>
            <span>54B, Tailstoi Town 5238 MT, La city, IA 522364</span>
          </div>
          <div className="footer-contact-item">
            <svg
              className="footer-icon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M18 2H2C0.9 2 0 2.9 0 4V16C0 17.1 0.9 18 2 18H18C19.1 18 20 17.1 20 16V4C20 2.9 19.1 2 18 2ZM18 6L10 11L2 6V4L10 9L18 4V6Z"
                fill="#DC143C"
              />
            </svg>
            <span>Email us : contact@autorex.com</span>
          </div>
          <div className="footer-contact-item">
            <svg
              className="footer-icon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M17.5 13.5C16.4 13.5 15.4 13.3 14.5 12.9C14.3 12.8 14.1 12.7 13.8 12.7C13.5 12.7 13.2 12.8 13 13L11.2 14.8C8.4 13.5 6.5 11.6 5.2 8.8L7 7C7.2 6.8 7.3 6.5 7.3 6.2C7.3 5.9 7.2 5.7 7.1 5.5C6.7 4.6 6.5 3.6 6.5 2.5C6.5 1.9 6.1 1.5 5.5 1.5H2.5C1.9 1.5 1.5 1.9 1.5 2.5C1.5 11.3 8.7 18.5 17.5 18.5C18.1 18.5 18.5 18.1 18.5 17.5V14.5C18.5 13.9 18.1 13.5 17.5 13.5Z"
                fill="#DC143C"
              />
            </svg>
            <span>Call us on : + 1800 456 7890</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-column">
            <p className="footer-description">
              A to Z Auto Repair provides reliable, affordable, and high-quality
              automotive services. From routine maintenance to full diagnostics
              and repairs, our certified technicians are here to keep your
              vehicle running safely and smoothly.
            </p>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">Usefull Links</h3>
            <ul className="footer-links">
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#home">Appointment</a>
              </li>
              <li>
                <a href="#testimonials">Testimonials</a>
              </li>
              <li>
                <a href="#contact">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">Our Services</h3>
            <ul className="footer-links">
              <li>
                <a href="#performance">Performance Upgrade</a>
              </li>
              <li>
                <a href="#transmission">Transmission Service</a>
              </li>
              <li>
                <a href="#brake">Brake Repair & Service</a>
              </li>
              <li>
                <a href="#engine">Engine Service & Repair</a>
              </li>
              <li>
                <a href="#tire">Tire & Wheels</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">Newsletter</h3>
            <p className="newsletter-text">Get latest updates and offers.</p>
            <div className="social-icons">
              <a href="#facebook" className="social-icon" aria-label="Facebook">
                <span>
                  <FaFacebookF />
                </span>
              </a>
              <a href="#linkedin" className="social-icon" aria-label="LinkedIn">
                <span>
                  <FaLinkedinIn />
                </span>
              </a>
              <a href="#twitter" className="social-icon" aria-label="Twitter">
                <span>
                  <FaXTwitter />
                </span>
              </a>
              <a href="#google" className="social-icon" aria-label="Google+">
                <span>
                  <FaGooglePlusG />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

