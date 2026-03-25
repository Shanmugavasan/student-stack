import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t py-12 mt-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-400 text-sm">© 2026 StudentStack.co.uk</p>
        <div className="flex gap-8 text-sm font-bold text-gray-600">
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact</Link>
          <Link to="/privacy" className="hover:text-blue-600">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}