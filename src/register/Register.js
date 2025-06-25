import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const RegisterPage = () => {
  const [ownerName, setOwnerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopLocation, setShopLocation] = useState('');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const navigate = useNavigate();

  const validateEmailOrMobile = (value) => {
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Mobile regex (supports various formats)
    const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    return emailRegex.test(value) || mobileRegex.test(value);
  };

  // Function to get reverse geocoding (coordinates to address)
  const reverseGeocode = async (latitude, longitude) => {
    try {
      // Using OpenStreetMap's Nominatim service (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      } else {
        return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  // Function to get IP-based location as fallback
  const getIPLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.city && data.region && data.country) {
        return `${data.city}, ${data.region}, ${data.country}`;
      }
      return null;
    } catch (error) {
      console.error('IP location failed:', error);
      return null;
    }
  };

  // Function to get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser. Trying alternative method...');
      // Try IP-based location as fallback
      getIPLocation().then(location => {
        if (location) {
          setShopLocation(location + ' (Approximate)');
        } else {
          alert('Unable to detect location. Please enter manually.');
        }
        setIsGettingLocation(false);
      });
      return;
    }

    // First try with high accuracy
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        try {
          // Get readable address from coordinates
          const address = await reverseGeocode(latitude, longitude);
          const accuracyText = accuracy > 100 ? ' (Approximate)' : '';
          setShopLocation(address + accuracyText);
        } catch (error) {
          console.error('Error getting address:', error);
          // Fallback to coordinates if reverse geocoding fails
          setShopLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
        
        setIsGettingLocation(false);
      },
      async (error) => {
        console.log('High accuracy failed, trying with lower accuracy...', error);
        
        // Try again with lower accuracy settings
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
              const address = await reverseGeocode(latitude, longitude);
              setShopLocation(address + ' (Approximate)');
            } catch (error) {
              setShopLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)} (Approximate)`);
            }
            
            setIsGettingLocation(false);
          },
          async (secondError) => {
            console.log('Both GPS attempts failed, trying IP location...', secondError);
            
            // Try IP-based location as final fallback
            const ipLocation = await getIPLocation();
            
            if (ipLocation) {
              setShopLocation(ipLocation + ' (Approximate - please verify)');
              setIsGettingLocation(false);
            } else {
              setIsGettingLocation(false);
              
              // Show detailed error message
              let errorMessage = 'Unable to detect your location automatically. ';
              
              switch (secondError.code) {
                case secondError.PERMISSION_DENIED:
                  errorMessage += 'Location access was denied. Please allow location access and try again, or enter your address manually.';
                  break;
                case secondError.POSITION_UNAVAILABLE:
                  errorMessage += 'Location services are unavailable. This might be due to:\n\n• Weak GPS signal (try moving to an open area)\n• Location services disabled in your device\n• Using HTTP instead of HTTPS\n\nPlease enter your location manually.';
                  break;
                case secondError.TIMEOUT:
                  errorMessage += 'Location request timed out. Please check your internet connection and try again, or enter your location manually.';
                  break;
                default:
                  errorMessage += 'Please enter your location manually.';
                  break;
              }
              
              alert(errorMessage);
            }
          },
          {
            enableHighAccuracy: false,  // Lower accuracy for better compatibility
            timeout: 15000,             // Longer timeout
            maximumAge: 300000          // Allow cached location up to 5 minutes
          }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  };

  const handleLocationClick = () => {
    getCurrentLocation();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!ownerName.trim()) {
      alert('Owner name is required.');
      return;
    }
    
    if (!shopName.trim()) {
      alert('Shop name is required.');
      return;
    }
    
    if (!shopLocation.trim()) {
      alert('Shop location is required.');
      return;
    }
    
    if (!emailOrMobile.trim()) {
      alert('Email or mobile number is required.');
      return;
    }
    
    if (!validateEmailOrMobile(emailOrMobile)) {
      alert('Please enter a valid email address or mobile number.');
      return;
    }
    
    if (!password) {
      alert('Password is required.');
      return;
    }
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }
    
    console.log('Registration attempted with:', { 
      ownerName, 
      shopName, 
      shopLocation, 
      emailOrMobile, 
      password, 
      rememberMe 
    });
    
    // After successful registration, redirect to login
    navigate('/login');
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="register-container">
      {/* Background decorative elements */}
      {/* <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>
      <div className="bg-shape shape-4"></div>
      <div className="bg-shape shape-5"></div> */}
      
      <div className="register-card">
        <div className="register-header">
          <div className="logo">
            <div className="logo-icon">
              <div className="check-mark check-1"></div>
              <div className="check-mark check-2"></div>
            </div>
          </div>
          <h2>MEDICARE</h2>
        </div>
        
        <div className="register-form">
          <div className="input-group">
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Owner Name"
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Shop Name"
              className="form-input"
              required
            />
          </div>

          <div className="input-group location-input-group">
            <input
              type="text"
              value={shopLocation}
              onChange={(e) => setShopLocation(e.target.value)}
              placeholder="Shop Location"
              className="form-input"
              required
              onClick={handleLocationClick}
              readOnly={isGettingLocation}
            />
            <button 
              type="button"
              onClick={handleLocationClick}
              className="location-btn"
              disabled={isGettingLocation}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: isGettingLocation ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                color: '#007bff',
                padding: '5px'
              }}
            >
              {isGettingLocation ? '📍...' : '📍'}
            </button>
          </div>
          
          <div className="input-group">
            <input
              type="text"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              placeholder="Email or Mobile Number"
              className="form-input"
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="form-input"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="form-input"
              required
            />
          </div>
          
          <button onClick={handleSubmit} className="sign-up-btn">
            Sign up
          </button>
          
          <div className="login-link">
            <span className="login-text">
              Already have an account? <a href="#" onClick={handleLoginClick} className="login-link-text">Sign in</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;