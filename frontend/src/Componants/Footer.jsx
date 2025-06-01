import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6 text-center mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center">
        
        {/* Brand Name */}
        <div>
          <h2 className="text-lg font-bold">CapsuleApp</h2>
          <p className="text-sm text-gray-400">Time Capsules for Your Future</p>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 md:mt-0">
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
            <li><Link to="/about" className="hover:text-gray-400">About</Link></li>
            <li><Link to="/contact" className="hover:text-gray-400">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-gray-400">Privacy</Link></li>
          </ul>
        </nav>

        {/* Copyright */}
        <div className="mt-4 md:mt-0 text-sm text-gray-400">
          © {new Date().getFullYear()} Capsule App. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
