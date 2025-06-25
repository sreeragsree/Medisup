import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Map, Calendar, Bookmark, MessageCircle, User, Settings, Bell, Star, MapPin, LogOut, Menu } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const recentSearches = [
    { id: 1, image: '/api/placeholder/200/150', title: 'Paracetamol', subtitle: 'Pain Relief', date: 'from 2024' },
    { id: 2, image: '/api/placeholder/200/150', title: 'Amoxicillin', subtitle: 'Antibiotic', date: 'from 2024' },
    { id: 3, image: '/api/placeholder/200/150', title: 'Vitamin D3', subtitle: 'Supplements', date: 'from 2024' }
  ];

  const accommodations = [
    {
      id: 1,
      image: '/api/placeholder/300/200',
      title: 'Apollo Pharmacy - Complete healthcare solutions with certified medicines',
      location: 'Downtown Medical Center',
      rating: 4.8,
      reviews: 124,
      amenities: ['24/7 Service', 'Home Delivery', 'Insurance']
    },
    {
      id: 2,
      image: '/api/placeholder/300/200',
      title: 'MedPlus Store - Wide range of medicines and health products',
      location: 'City Health Plaza',
      rating: 4.9,
      reviews: 87,
      amenities: ['Online Order', 'Consultation', 'Lab Tests']
    }
  ];

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Map, label: 'Map' },
    { icon: Calendar, label: 'Calendar' },
    { icon: Bookmark, label: 'Bookings' },
    { icon: MessageCircle, label: 'Messages' }
    // { icon: User, label: 'Profile' },
    // { icon: Settings, label: 'Settings' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUserIconClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleLogout = () => {
    setShowUserDropdown(false);
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu />
      </button>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="logo">MEDICARE</h1>
        </div>
        <nav>
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`nav-item ${item.active ? 'active' : ''}`}
              onClick={() => setActiveTab(item.label)}
            >
              <item.icon className="nav-icon" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="header-top">
            <div>
              <h2 className="header-title">What medicine do you need, Usha Medicals?</h2>
              <p className="header-subtitle">Find the best medicines and healthcare products near you</p>
            </div>
            <div className="header-actions">
              <Bell className="notification-icon" />
              <div className="user-avatar-container" ref={dropdownRef}>
                <div className="user-avatar" onClick={handleUserIconClick}>
                  <User className="w-6 h-6 text-white" />
                </div>
                {showUserDropdown && (
                  <div className="user-dropdown">
                    <div className="dropdown-item" onClick={() => setActiveTab('Profile')}>
                      <User className="dropdown-icon" />
                      <span>Profile</span>
                    </div>
                    <div className="dropdown-item" onClick={() => setActiveTab('Settings')}>
                      <Settings className="dropdown-icon" />
                      <span>Settings</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item logout-item" onClick={handleLogout}>
                      <LogOut className="dropdown-icon" />
                      <span>Logout</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search medicines, drugs, healthcare products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-tabs">
            {['Medicines', 'Prescriptions', 'Supplements', 'Medical Devices', 'Health Care'].map((tab) => (
              <button
                key={tab}
                className={`filter-tab ${tab === 'Medicines' ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="content-area">
          <div className="section-header">
            <h3 className="section-title">Your recent searches</h3>
            <button className="see-all-btn">See all</button>
          </div>
          <div className="grid-3">
            {recentSearches.map((search) => (
              <div key={search.id} className="card">
                <div className="card-image">
                  <div className="card-image-content">
                    <h4 className="card-image-title">{search.title}</h4>
                    <p className="card-image-subtitle">{search.subtitle}</p>
                  </div>
                </div>
                <div className="card-content">
                  <p className="card-date">{search.date}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="section-title">Find trusted pharmacies and medical stores</h3>
            <p className="section-description">Certified pharmacies, online consultations, home delivery... We have it all!</p>
            <div className="grid-2">
              {accommodations.map((accommodation) => (
                <div key={accommodation.id} className="pharmacy-card">
                  <div className="pharmacy-image"></div>
                  <div className="pharmacy-content">
                    <h4 className="pharmacy-title">{accommodation.title}</h4>
                    <div className="pharmacy-location">
                      <MapPin className="location-icon" />
                      <span>{accommodation.location}</span>
                    </div>
                    <div className="pharmacy-footer">
                      <div className="rating-section">
                        <Star className="star-icon" />
                        <span className="rating-text">{accommodation.rating}</span>
                        <span className="reviews-text">({accommodation.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
