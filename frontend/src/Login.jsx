import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('userName', response.data.user.name);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid Credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
      backgroundImage: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.9)), url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1920")',
      backgroundSize: 'cover', backgroundPosition: 'center'
    }}>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.08)', padding: '45px 40px', borderRadius: '24px', 
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)', width: '390px', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ fontSize: '36px', background: 'rgba(255,255,255,0.1)', width: '65px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', margin: '0 auto 15px auto', border: '1px solid rgba(255,255,255,0.2)' }}>📚</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '6px' }}>Digital LMS Portal</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Sign in to access your dashboard</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#cbd5e1' }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@library.com"
                   style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '15px' }} />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#cbd5e1' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                   style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '15px' }} />
          </div>

          <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;