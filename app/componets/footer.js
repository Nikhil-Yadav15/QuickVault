import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-black py-3 mt-auto">
        <p className="text-center text-gray-300 text-sm md:text-base">
        Created by{' '}
        <a
          href="https://www.linkedin.com/in/nikhil-yadav-593a98321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-400 hover:underline cursor-pointer"
        >
          Nikhil Yadav | ECE&apos;28
        </a>
      </p>
    </footer>
  );
};

export default Footer;
