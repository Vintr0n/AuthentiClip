import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <nav className="bg-white shadow p-4 mb-6">
      <ul className="flex space-x-4">
        <li><Link to="/upload" className="hover:underline">Upload</Link></li>
        <li><Link to="/verify" className="hover:underline">Verify</Link></li>
        <li><Link to="/login" className="hover:underline">Login</Link></li>
        <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
        <li><Link to="/about" className="hover:underline">About</Link></li>
      </ul>
    </nav>
  )
}
