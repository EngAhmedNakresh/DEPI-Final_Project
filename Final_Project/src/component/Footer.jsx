import React from "react";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <footer className="footer-section ">
        <div className="container">

          {/* Top Section */}
          <div className="row gy-4">

            {/* Brand */}
            <div className="col-12 col-md-6 col-lg-3">
              <h5 className="footer-brand">PortfolioGenie</h5>
              <p className="footer-description mt-3">
                Helping developers tell their story through code, one commit at a time.
              </p>
            </div>

            {/* Product */}
            <div className="col-6 col-md-3 col-lg-3">
              <h6 className="footer-title">Product</h6>
              <ul className="footer-links">
                <li><a href="#">Features</a></li>
                <li><a href="#">Integrations</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="col-6 col-md-3 col-lg-3">
              <h6 className="footer-title">Resources</h6>
              <ul className="footer-links">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API Reference</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">Help Center</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="col-12 col-md-6 col-lg-3">
              <h6 className="footer-title">Company</h6>
              <ul className="footer-links">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Privacy</a></li>
              </ul>
            </div>

          </div>

          <hr className="footer-divider my-4" />

          {/* Bottom */}
          <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <p className="mb-0 small">
              © 2026 PortfolioGenie Inc. All rights reserved.create by eng Ahmed salah eldin.
            </p>

            <div className="footer-social d-flex gap-4">
              <a href="http://linkedin.com/in/ahmed-salah-eldin-dev" target="_blank" rel="noreferrer">
                <FaLinkedin />
              </a>
              <a href="https://github.com/EngAhmedNakresh" target="_blank" rel="noreferrer">
                <FaGithub />
              </a>
              <a href="mailto:ahmednakresh827@gmail.com">
                <FaEnvelope />
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Footer;