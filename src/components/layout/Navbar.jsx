// src/layout/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
  <nav className="navbar navbar-expand-lg  custom-navbar" style={{
  background: "linear-gradient(90deg, #84b8e2, #84d816)"
}}>
      <div className="container">
        <img src='../../public/logo.png' style={{
            width: "200px",
            borderRadius: "100px",
            border: "3px solid #fff",
            padding: "5px",
            boxShadow: "0 4px 15px rgba(57, 199, 22, 0.2)",
  }} alt='Beauty Academy' />
        

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li><Link className="nav-link" to="/">Home</Link></li>
            <li><Link className="nav-link" to="/about">About</Link></li>
            <li><Link className="nav-link" to="/services">Services</Link></li>
            <li><Link className="nav-link" to="/contact">Contact</Link></li>
            <li><Link className="nav-link" to="/admin/login">Admin</Link></li>
            <li><Link className="nav-link" to="/user">User</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}