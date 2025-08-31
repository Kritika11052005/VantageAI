// components/Footer.jsx (Static version - not fixed to bottom)
import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-dark-100/50 backdrop-blur-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-6">
        {/* Made by text */}
        <div className="text-light-100 text-sm">
          Made with{' '}
          <span className="text-destructive-100">❤️</span>
          {' '}by{' '}
          <span className="font-bold bg-gradient-to-r from-primary-200 to-primary-100 bg-clip-text text-transparent">
            Kritika Benjwal
          </span>
        </div>

        {/* Social links */}
        <div className="flex gap-3">
          <a
            href="https://github.com/kritikabenjwal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-200/50 border border-border text-light-100 hover:bg-primary-200/10 hover:border-primary-200/30 hover:text-primary-200 transition-all duration-300 hover:-translate-y-0.5"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/kritikabenjwal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-200/50 border border-border text-light-100 hover:bg-primary-200/10 hover:border-primary-200/30 hover:text-primary-200 transition-all duration-300 hover:-translate-y-0.5"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:kritika.benjwal@example.com"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-200/50 border border-border text-light-100 hover:bg-primary-200/10 hover:border-primary-200/30 hover:text-primary-200 transition-all duration-300 hover:-translate-y-0.5"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>

      {/* Mobile responsive layout */}
      <div className="md:hidden flex flex-col items-center gap-3 max-w-7xl mx-auto px-6 pb-6 -mt-6">
        <div className="text-light-100 text-xs text-center">
          Made with{' '}
          <span className="text-destructive-100">❤️</span>
          {' '}by{' '}
          <span className="font-bold bg-gradient-to-r from-primary-200 to-primary-100 bg-clip-text text-transparent">
            Kritika Benjwal
          </span>
        </div>
        <div className="flex gap-3">
          <a
            href="https://github.com/Kritika11052005"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-dark-200/50 border border-border text-light-100 hover:bg-primary-200/10 hover:border-primary-200/30 hover:text-primary-200 transition-all duration-300"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/kritika-benjwal/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-dark-200/50 border border-border text-light-100 hover:bg-primary-200/10 hover:border-primary-200/30 hover:text-primary-200 transition-all duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=ananya.benjwal@gmail.com"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-dark-200/50 border border-border text-light-100 hover:bg-primary-200/10 hover:border-primary-200/30 hover:text-primary-200 transition-all duration-300"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;