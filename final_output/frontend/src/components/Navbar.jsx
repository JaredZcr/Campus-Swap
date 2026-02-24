import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export function Navbar({ onSellClick, onHomeClick, onSearch, onNavigate, onLoginClick, onAdminClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    onHomeClick && onHomeClick();
  };

  return (
    <nav className="navbar">
      <div className="navbar_container">
        <div className="navbar_logo" onClick={onHomeClick}>
          <div className="navbar_logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor"/>
              <rect x="8" y="8" width="8" height="8" rx="1" fill="white"/>
            </svg>
          </div>
          <span className="navbar_logo-text">Campus Swap</span>
        </div>

        <div className="navbar_search">
          <div className="navbar_search-wrapper">
            <Search className="navbar_search-icon" size={18} />
            <input
              type="text"
              className="navbar_search-input"
              placeholder="Search textbooks, electronics, furniture..."
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="navbar_actions">
          {user ? (
            <>
              <button className="navbar_sell-btn" onClick={onSellClick}>
                <Plus size={18} />Sell Item
              </button>
              <div className="navbar_user">
                <button className="navbar_user-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <span className="navbar_user-name">{user.nickname || user.accountNumber}</span>
                  <img src={user.avatar || 'https://i.pravatar.cc/150?img=1'} alt="User" className="navbar_avatar" />
                </button>

                {isMenuOpen && (
                  <div className="navbar_dropdown">
                    <div className="navbar_dropdown-header">
                      <div className="navbar_dropdown-label">Signed in as</div>
                      <div className="navbar_dropdown-email">{user.accountNumber}</div>
                    </div>
                    <div className="navbar_dropdown-section">
                      <button
                        className="navbar_dropdown-item"
                        onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Profile
                      </button>
                      <button
                        className="navbar_dropdown-item"
                        onClick={() => { onNavigate('addresses'); setIsMenuOpen(false); }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z"/><circle cx="12" cy="10" r="3"/></svg>
                        Addresses
                      </button>
                      <button className="navbar_dropdown-item" onClick={() => { onAdminClick && onAdminClick(); setIsMenuOpen(false); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1l3 5 5 1-3.5 4 0.8 5L12 14.8 6.7 16 7.5 11 4 7l5-1 3-5z"/></svg>
                        Admin Panel
                      </button>
                      <button className="navbar_dropdown-item" onClick={() => { onNavigate('myListings'); setIsMenuOpen(false); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                        My Listings
                      </button>
                      <button className="navbar_dropdown-item" onClick={() => { onNavigate('orders'); setIsMenuOpen(false); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        My Orders
                      </button>
                      <button className="navbar_dropdown-item" onClick={() => { onNavigate('messages'); setIsMenuOpen(false); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                        Messages
                      </button>
                      <button className="navbar_dropdown-item" onClick={() => { onNavigate('favorites'); setIsMenuOpen(false); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        Saved Items
                      </button>
                      <button className="navbar_dropdown-item navbar_dropdown-logout" onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9"/></svg>
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="navbar_admin-btn" onClick={onAdminClick}>Admin</button>
              <button className="navbar_sell-btn" onClick={onLoginClick}>Sign In</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
