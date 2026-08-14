import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-inner">
          <span className="logo">Booking Platform</span>
          <nav className="nav">
            <Link to="/">Home</Link>
            {!user && <Link to="/login">Log In</Link>}
            {!user && <Link to="/signup">Sign Up</Link>}
            {user?.role === 'provider' && <Link to="/provider/dashboard">Dashboard</Link>}
            {user?.role === 'customer' && <Link to="/customer/dashboard">Dashboard</Link>}
            {user && <button onClick={handleLogout}>Log Out</button>}
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>Customers browse services · Providers manage availability</p>
        </div>
      </footer>
    </div>
  );
}