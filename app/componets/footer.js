import React from 'react';

const Footer = () => {
  return (
    <footer className="relative z-10 py-4 mt-auto border-t border-white/[0.06] glass">
      <p className="text-center text-white/40 text-sm">
        Created by{' '}
        <a
          href="https://www.linkedin.com/in/nikhil-yadav-593a98321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-emerald-400/80 hover:text-emerald-300 transition-colors duration-200"
        >
          Nikhil Yadav | ECE&apos;28
        </a>
      </p>
    </footer>
  );
};

export default Footer;
