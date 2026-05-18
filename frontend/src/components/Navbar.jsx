import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Users, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand">
        <Link to="/">AI EmpAnalytics</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={18} /> Dashboard
        </Link>
        <Link to="/recommendations" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a855f7' }}>
          <Sparkles size={18} /> AI Insights
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <User size={18} /> {user.email.split('@')[0]}
          </span>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
