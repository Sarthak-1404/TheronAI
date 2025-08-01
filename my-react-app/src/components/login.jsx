import React, { useState } from 'react';
import './login.css';

const Login = ({ onLogin, onClose, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted with:', { email, password });
    setIsLoading(true);
    
    try {
      // First try demo login for backward compatibility
      if (email === 'user@123' && password === 'user123') {
        console.log('Demo credentials matched, logging in...');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Call the onLogin function with user data
        console.log('Calling onLogin function...');
        onLogin(email, password, { email, name: 'Demo User', role: 'user' });
        return;
      }

      // Try real API login
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        console.log('Login successful:', data);
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Call the onLogin function with real user data
        onLogin(email, password, data.data.user);
      } else {
        console.log('Login failed:', data.message);
        alert(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-modal-bg">
      <div className="login-modal">
        <button className="login-close" onClick={onClose}>&times;</button>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            disabled={isLoading}
            placeholder="Enter your email"
          />
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            disabled={isLoading}
            placeholder="Enter your password"
          />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" disabled={isLoading} onClick={() => console.log('Login button clicked')}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Demo credentials */}
        <div className="login-demo">
          <p><strong>Demo Credentials:</strong></p>
          <p><strong>User Login:</strong></p>
          <p>Email: user@123 | Password: user123</p>
          <p><strong>Admin Login:</strong></p>
          <p>Email: admin@smarthealth.com | Password: admin123</p>
          <p><em>Use these credentials to access the dashboard!</em></p>
        </div>
      </div>
    </div>
  );
};

export default Login; 