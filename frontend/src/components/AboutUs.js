// AboutUs.js
import React from 'react';
import './AboutUs.css';

const AboutUs = ({ onBack }) => {
  return (
    <div className="about-us-container">
      <div className="about-header">
        <h1 className="about-title">Welcome to Axiom</h1>
        <p className="about-tagline">The talk of the campus. Stay in the know-how.</p>
      </div>
      <div className="about-body">
        <div className="about-description">
          <p>
            Tired of sifting through endless WhatsApp groups, messy Drive links, and chaotic email threads?
            Axiom is here to streamline your campus experience at RVCE! We bring all the news, events, and
            community insights together on one dynamic platform.
          </p>
          <p>
            From hackathons and club fests to dorm chats and second-hand marketplaces, we’re redefining how you
            connect with campus life. Verified RVCE insiders, we’re the only platform you need for a seamless,
            uncluttered news experience.
          </p>
          <p>
            Join us as we turn everyday campus life into something extraordinary—with style, creativity, and a
            whole lot of heart.
          </p>
        </div>
        <div className="about-team">
          <div className="dev-card">
            <img src="aditya.jpg" alt="Developer One" className="dev-image" />
            <h3 className="dev-name">Aditya Lanka</h3>
            <p className="dev-role">
                The one and only, you know him and you've seen him.
            </p>
          </div>
          <div className="dev-card">
            <img src="kushagra.jpg" alt="Developer Two" className="dev-image" />
            <h3 className="dev-name">Kushagra Awasthi</h3>
            <p className="dev-role">
              The coding wizard ensuring Axiom runs smoothly day and night.
            </p>
          </div>
        </div>
      </div>
      <button onClick={onBack} className="back-button">
        Back to Home
      </button>
    </div>
  );
};

export default AboutUs;
