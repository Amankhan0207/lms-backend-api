import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books');
  const [searchTerm, setSearchTerm] = useState(''); 
  
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') || 'student';
  const name = localStorage.getItem('userName') || 'User';

  const fetchData = () => {
    axios.get('http://127.0.0.1:8000/api/dashboard-data')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) return navigate('/');
    fetchData();
  }, [navigate]);

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newTitle || !newAuthor) return alert("Fields cannot be empty!");
    axios.post('http://127.0.0.1:8000/api/books', { title: newTitle, author: newAuthor, category: 'Programming', total_copies: 5, available_copies: 5 })
      .then(() => { alert("🎉 Book Added!"); setNewTitle(''); setNewAuthor(''); setFormOpen(false); fetchData(); })
      .catch(err => alert("Error adding book!"));
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#fff' }}>Loading Library Console...</div>;

  const filteredBooks = data?.books?.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.author.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div style={{ 
      minHeight: '100vh', 
      // 📚 Elite Modern Library Academic Interior Background
      backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.94)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1920&auto=format&fit=crop')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif', 
      paddingBottom: '40px' 
    }}>
      
      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', background: 'rgba(30, 41, 59, 0.65)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ background: '#b45309', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold' }}>📖</div><h3 style={{ margin: 0, fontWeight: '800', letterSpacing: '-0.5px' }}>LMS Workspace</h3></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}><h5 style={{ margin: 0 }}>{name}</h5><span style={{ fontSize: '10px', color: '#94a3b8' }}>{role.toUpperCase()}</span></div>
          <button onClick={() => { localStorage.clear(); navigate('/'); }} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
        {/* METRICS */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, padding: '20px', background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><small style={{ color: '#94a3b8', fontWeight: 600 }}>LIBRARY VALUT</small><h2 style={{ margin: '4px 0 0', color: '#f59e0b' }}>{data?.total_books_count || 0}</h2></div><span>📚</span></div>
          {role === 'admin' && (
            <>
              <div style={{ flex: 1, padding: '20px', background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><small style={{ color: '#94a3b8', fontWeight: 600 }}>MEMBERS ROSTER</small><h2 style={{ margin: '4px 0 0', color: '#f59e0b' }}>{data?.total_users_count || 0}</h2></div><span>👥</span></div>
              <div style={{ flex: 1, padding: '20px', background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><small style={{ color: '#94a3b8', fontWeight: 600 }}>ISSUANCE LOGS</small><h2 style={{ margin: '4px 0 0', color: '#f59e0b' }}>{data?.total_transactions_count || 0}</h2></div><span>🔄</span></div>
            </>
          )}
        </div>

        {/* HEADER CONTROLS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '10px', display: 'flex', gap: '2px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={() => setActiveTab('books')} style={{ padding: '8px 16px', background: activeTab === 'books' ? '#b45309' : 'transparent', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Books Catalog</button>
            {role === 'admin' && (
              <>
                <button onClick={() => setActiveTab('users')} style={{ padding: '8px 16px', background: activeTab === 'users' ? '#b45309' : 'transparent', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>User Index</button>
                <button onClick={() => setActiveTab('transactions')} style={{ padding: '8px 16px', background: activeTab === 'transactions' ? '#b45309' : 'transparent', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Circulation</button>
              </>
            )}
          </div>

          {activeTab === 'books' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="🔍 Find book or author..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', fontSize: '14px', background: 'rgba(30, 41, 59, 0.7)', color: '#fff' }} />
              {role === 'admin' && <button onClick={() => setFormOpen(!formOpen)} style={{ padding: '8px 16px', background: '#b45309', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>{formOpen ? '✕' : '➕ Add Book'}</button>}
            </div>
          )}
        </div>

        {/* SECURE ADD FORM */}
        {role === 'admin' && formOpen && activeTab === 'books' && (
          <form onSubmit={handleAddBook} style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
            <input type="text" placeholder="Book Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', fontSize: '14px', background: 'rgba(15, 23, 42, 0.6)', color: '#fff', flex: 1 }} />
            <input type="text" placeholder="Author" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', fontSize: '14px', background: 'rgba(15, 23, 42, 0.6)', color: '#fff', flex: 1 }} />
            <button type="submit" style={{ padding: '9px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Save to Vault</button>
          </form>
        )}

        {/* TABLES GRID */}
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          {activeTab === 'books' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.5)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', textAlign: 'left' }}>Catalog ID</th><th style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.5)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', textAlign: 'left' }}>Resource Title</th><th style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.5)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', textAlign: 'left' }}>Author</th><th style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.5)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', textAlign: 'left' }}>Availability</th></tr></thead>
              <tbody>
                {filteredBooks.map(b => (
                  <tr key={b.book_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td style={{ padding: '14px 20px', color: '#cbd5e1', fontFamily: 'monospace' }}>#BK-{b.book_id}</td><td style={{ padding: '14px 20px', fontWeight: '700', color: '#fff' }}>{b.title}</td><td style={{ padding: '14px 20px', color: '#cbd5e1' }}>{b.author}</td><td style={{ padding: '14px 20px' }}><span style={{ color: b.available_copies > 0 ? '#10b981' : '#ef4444', fontWeight: '700' }}>{b.available_copies} Units Available</span></td></tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'users' && role === 'admin' && data?.users && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.5)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', textAlign: 'left' }}>User ID</th><th style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.5)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', textAlign: 'left' }}>Full Name</th><th style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.5)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', textAlign: 'left' }}>Email Secure</th><th style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.5)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', textAlign: 'left' }}>Clearance</th></tr></thead>
              <tbody>
                {data.users.map(u => (
                  <tr key={u.user_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td style={{ padding: '14px 20px', color: '#cbd5e1', fontFamily: 'monospace' }}>#USR-{u.user_id}</td><td style={{ padding: '14px 20px', fontWeight: '600', color: '#fff' }}>{u.name}</td><td style={{ padding: '14px 20px', color: '#cbd5e1' }}>{u.email}</td><td style={{ padding: '14px 20px' }}><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', background: u.role === 'admin' ? '#fef3c7' : '#e0f2fe', color: u.role === 'admin' ? '#b45309' : '#0369a1' }}>{u.role.toUpperCase()}</span></td></tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'transactions' && role === 'admin' && data?.transactions && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.5)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', textAlign: 'left' }}>TX ID</th><th style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.5)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', textAlign: 'left' }}>Student Borrower</th><th style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.5)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', textAlign: 'left' }}>Allocated Asset</th><th style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.5)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', textAlign: 'left' }}>Status</th></tr></thead>
              <tbody>
                {data.transactions.map(t => (
                  <tr key={t.transaction_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td style={{ padding: '14px 20px', color: '#cbd5e1', fontFamily: 'monospace' }}>#TX-{t.transaction_id}</td><td style={{ padding: '14px 20px', color: '#fff' }}>{t.student_name}</td><td style={{ padding: '14px 20px', color: '#cbd5e1' }}>{t.book_title}</td><td style={{ padding: '14px 20px' }}><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', background: t.status === 'issued' ? '#fee2e2' : '#dcfce7', color: t.status === 'issued' ? '#ef4444' : '#10b981' }}>{t.status.toUpperCase()}</span></td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;