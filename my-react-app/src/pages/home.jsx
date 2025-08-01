import React from 'react';
import './home.css';
import HomeNav from '../components/homenav';

const Home = ({ onLoginClick, onSignupClick, onSymptomCheckerClick, onChatbotClick }) => {
  const handleSymptomChecker = () => {
    console.log('Symptom checker clicked');
    onSymptomCheckerClick();
  };

  const handleChatbot = () => {
    console.log('Chatbot clicked');
    onChatbotClick();
  };

  const handleGetStarted = () => {
    console.log('Get started clicked');
    onSignupClick(); // Open signup page
  };

  const handleAboutClick = () => {
    console.log('About us clicked');
    // Navigate to about page
  };

  const handleContactClick = () => {
    console.log('Contact us clicked');
    // Navigate to contact page
  };

  return (
    <div className="home">
      <HomeNav 
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onAboutClick={handleAboutClick}
        onContactClick={handleContactClick}
      />
      
      {/* Hero Section */}
      <div className="hero-section">
        <div className="home-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Your Health,<br />
              Our Intelligence
            </h1>
            <p className="hero-descriptionP">
              SmartHealth is an AI-powered health platform that provides personalized health insights, 
              symptom checking, and virtual consultations with healthcare professionals.
            </p>
            
            {/* Action Buttons in Row */}
            <div className="hero-buttons">
              <button className="hero-btn primary-btn" onClick={handleSymptomChecker}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
                  <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
                  <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"></path>
                  <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"></path>
                </svg>
                <span className="btn-text">Symptom Checker</span>
                <span className="btn-hover-text">Try Now</span>
              </button>
              <button className="hero-btn secondary-btn" onClick={handleChatbot}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span className="btn-text">Talk to Chatbot</span>
                <span className="btn-hover-text">Try Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="home-container">
          <h2 className="section-title">Why Choose SmartHealth?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M2 12h20"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <h3>AI-Powered Diagnosis</h3>
              <p>Advanced machine learning algorithms provide accurate symptom analysis and health recommendations.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>Expert Consultations</h3>
              <p>Connect with qualified healthcare professionals for personalized medical advice and consultations.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
                  <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
                </svg>
              </div>
              <h3>Health Monitoring</h3>
              <p>Track your health metrics, symptoms, and progress with our comprehensive monitoring system.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <div className="home-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Smarter Health Choices</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">95%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available Support</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100+</div>
              <div className="stat-label">Expert Doctors</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="home-container">
          <div className="cta-content">
            <h2>Ready to Start Your Health Journey?</h2>
            <p>Join thousands of users who trust SmartHealth for their healthcare needs.</p>
            <button className="cta-btn" onClick={handleGetStarted}>
              Get Started Today
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Zigzag Image Sections */}
      <div className="image-section">
        <div className="image-container">
          <div className="image-content">
            <h3>AI-Powered Health Insights</h3>
            <p>Our advanced artificial intelligence analyzes your symptoms and provides personalized health recommendations. Get instant insights about your health conditions and potential treatments. Our AI system uses machine learning algorithms trained on millions of medical cases to provide accurate, evidence-based health assessments. Whether you're experiencing common symptoms or need guidance on chronic conditions, our AI assistant is here to help 24/7.</p>
            <ul className="feature-list">
              <li>Instant symptom analysis and health recommendations</li>
              <li>Personalized treatment suggestions based on your profile</li>
              <li>Evidence-based medical insights and guidance</li>
              <li>24/7 availability for health queries</li>
            </ul>
          </div>
          <div className="image-placeholder">
            <div className="image-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
                <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
                <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"></path>
                <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"></path>
              </svg>
            </div>
            <div className="image-text">AI Health Analysis</div>
          </div>
        </div>
      </div>

      <div className="image-section">
        <div className="image-container">
          <div className="image-content">
            <h3>Expert Medical Consultations</h3>
            <p>Connect with qualified healthcare professionals through our secure platform. Get personalized medical advice, diagnosis, and treatment plans from experienced doctors. Our network includes board-certified physicians, specialists, and healthcare providers across various medical fields. Schedule virtual consultations, get second opinions, and receive comprehensive care plans tailored to your specific health needs.</p>
            <ul className="feature-list">
              <li>Board-certified physicians and specialists</li>
              <li>Secure video consultations and messaging</li>
              <li>Comprehensive treatment plans and prescriptions</li>
              <li>Follow-up care and progress monitoring</li>
            </ul>
          </div>
          <div className="image-placeholder">
            <div className="image-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="image-text">Expert Consultations</div>
          </div>
        </div>
      </div>

      <div className="image-section">
        <div className="image-container">
          <div className="image-content">
            <h3>Comprehensive Health Monitoring</h3>
            <p>Track your health metrics, symptoms, and progress over time. Our comprehensive monitoring system helps you maintain optimal health and catch issues early. Monitor vital signs, medication adherence, lifestyle factors, and chronic conditions. Receive personalized alerts, trend analysis, and actionable insights to improve your health outcomes.</p>
            <ul className="feature-list">
              <li>Real-time health metrics tracking</li>
              <li>Medication adherence monitoring</li>
              <li>Personalized health alerts and reminders</li>
              <li>Trend analysis and health insights</li>
            </ul>
          </div>
          <div className="image-placeholder">
            <div className="image-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                <path d="M12 2v20"></path>
                <path d="M8 12h8"></path>
              </svg>
            </div>
            <div className="image-text">Health Monitoring</div>
          </div>
        </div>
      </div>

      <div className="image-section">
        <div className="image-container">
          <div className="image-content">
            <h3>Secure Health Records</h3>
            <p>Keep all your medical information organized and secure in one place. Access your health records anytime, anywhere, and share them safely with healthcare providers. Our HIPAA-compliant platform ensures your data privacy while providing easy access to medical history, test results, prescriptions, and treatment plans.</p>
            <ul className="feature-list">
              <li>HIPAA-compliant secure storage</li>
              <li>Easy sharing with healthcare providers</li>
              <li>Comprehensive medical history tracking</li>
              <li>Digital prescriptions and test results</li>
            </ul>
          </div>
          <div className="image-placeholder">
            <div className="image-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
            </div>
            <div className="image-text">Secure Records</div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <div className="contact-container">
          <div className="contact-content">
            <h2>Get in Touch</h2>
            <p>Have questions about our services? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
          
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Enter your name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Enter your message" required></textarea>
            </div>
            
            <button type="submit" className="contact-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>SmartHealth</h4>
              <p>Your trusted partner in healthcare. We provide AI-powered health insights and expert medical consultations.</p>
            </div>
            
            <div className="footer-section">
              <h4>Services</h4>
              <a href="#">AI Symptom Checker</a>
              <a href="#">Expert Consultations</a>
              <a href="#">Health Monitoring</a>
              <a href="#">Health Records</a>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Contact Us</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">FAQs</a>
              <a href="#">Live Chat</a>
              <a href="#">Emergency Contact</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 SmartHealth. All rights reserved. | Made with ❤️ for better healthcare</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
