import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ShieldAlert, AlertTriangle, Trash2, Ban, Activity, Users, Search } from 'lucide-react';

export default function AdminTab() {
  const [users, setUsers] = useState([]);
  const [globalFeed, setGlobalFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPlatformWealth, setTotalPlatformWealth] = useState(0);

  const fetchAdminData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = [];
      const allTrades = [];
      let totalWealth = 0;

      querySnapshot.forEach((document) => {
        const data = document.data();
        const flags = [];
        let tradeCount = 0;
        let netWorth = 0;

        if (data.portfolio) {
          tradeCount = data.portfolio.orderHistory ? data.portfolio.orderHistory.length : 0;
          if (tradeCount > 100) {
            flags.push('High Frequency Trading (Spam)');
          }

          netWorth = data.portfolio.balance;
          if (data.portfolio.positions) {
            netWorth += data.portfolio.positions.reduce((acc, pos) => acc + (pos.shares * pos.avgBuyPrice), 0);
          }

          if (netWorth > 16000000) {
            flags.push('Unrealistic Gains (> ₹1.6Cr)');
          }

          if (data.portfolio.cashDeposited > 0 && tradeCount < 5) {
            flags.push('In-Game Cash Deposited');
          }

          // Aggregate global feed
          if (data.portfolio.orderHistory) {
            data.portfolio.orderHistory.forEach(order => {
              allTrades.push({
                ...order,
                userEmail: data.email,
                userName: data.displayName || 'Anonymous',
                userId: document.id
              });
            });
          }
        }

        totalWealth += netWorth;

        usersData.push({
          id: document.id,
          email: data.email || 'No Email',
          name: data.displayName || 'Anonymous Trader',
          netWorth: netWorth,
          trades: tradeCount,
          flagged: data.flagged || false,
          aiFlags: flags,
          rawPortfolio: data.portfolio || null
        });
      });

      // Save total wealth to state (we need to add a state variable for it)
      setTotalPlatformWealth(totalWealth);

      // Sort feed by nearest timestamp (approximation since it's a string)
      allTrades.reverse();
      
      setUsers(usersData);
      setGlobalFeed(allTrades.slice(0, 100)); // Last 100 trades
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // Poll every 10 seconds
    const interval = setInterval(fetchAdminData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (userId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    
    try {
      const userRef = doc(db, 'users', userId);
      if (action === 'ban') {
        await updateDoc(userRef, { flagged: true });
        alert("User shadow-banned from leaderboard.");
      } else if (action === 'wipe') {
        // Reset portfolio
        await updateDoc(userRef, {
          portfolio: {
            balance: 8000000,
            positions: [],
            orders: [],
            orderHistory: [],
            realizedPnL: 0,
            todayPnL: 0,
            todayPnLPercent: 0,
            history: [{ value: 8000000 }]
          }
        });
        alert("User account wiped.");
      } else if (action === 'unban') {
        await updateDoc(userRef, { flagged: false });
        alert("User unbanned.");
      }
      fetchAdminData();
    } catch (e) {
      console.error("Action failed", e);
      alert("Action failed.");
    }
  };

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="tab-panel active" style={{ animation: 'fadeIn 300ms ease-out forwards' }}>
      <div className="section-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={28} color="var(--color-rose)" />
          <div>
            <h2 className="section-title" style={{ fontFamily: 'var(--font-header)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-rose)' }}>Admin Overwatch</h2>
            <span className="section-info">Global monitoring & AI Cheat Detection</span>
          </div>
        </div>
        <div className="glassy-card" style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', border: '1px solid var(--color-teal)' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Total Platform Wealth</span>
          <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
            ₹{totalPlatformWealth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* User Management */}
        <div className="glassy-card" style={{ display: 'flex', flexDirection: 'column', maxHeight: '70vh' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} /> User Database
            </h3>
            <div className="search-box" style={{ display: 'flex', alignItems: 'center', background: 'var(--color-bg)', padding: '6px 12px', borderRadius: '20px' }}>
              <Search size={16} color="var(--color-text-muted)" />
              <input 
                type="text" 
                placeholder="Search email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', marginLeft: '8px', outline: 'none', width: '150px' }}
              />
            </div>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
            {loading ? <p>Loading database...</p> : filteredUsers.map(user => (
              <div key={user.id} style={{ 
                background: user.flagged ? 'rgba(255, 77, 77, 0.1)' : 'var(--color-bg)', 
                padding: '16px', 
                borderRadius: '8px', 
                marginBottom: '12px',
                border: user.aiFlags.length > 0 ? '1px solid var(--color-orange)' : '1px solid transparent'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff' }}>{user.name} {user.flagged && <span style={{ color: 'var(--color-rose)', fontSize: '0.8rem' }}>(BANNED)</span>}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user.email}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono-text" style={{ color: 'var(--color-jade)' }}>₹{user.netWorth.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{user.trades} Trades</div>
                  </div>
                </div>
                
                {user.aiFlags.length > 0 && (
                  <div style={{ background: 'rgba(255, 165, 0, 0.1)', padding: '8px', borderRadius: '4px', marginBottom: '12px', fontSize: '0.8rem', color: 'var(--color-orange)', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>AI Flags:</strong> {user.aiFlags.join(', ')}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleAction(user.id, 'wipe')} className="trade-btn secondary-btn" style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'transparent', border: '1px solid var(--color-orange)', color: 'var(--color-orange)' }}>
                    <Trash2 size={12} style={{ marginRight: '4px', display: 'inline' }}/> Wipe
                  </button>
                  <button onClick={() => handleAction(user.id, user.flagged ? 'unban' : 'ban')} className="trade-btn secondary-btn" style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'transparent', border: '1px solid var(--color-rose)', color: 'var(--color-rose)' }}>
                    <Ban size={12} style={{ marginRight: '4px', display: 'inline' }}/> {user.flagged ? 'Unban' : 'Shadow Ban'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Trade Feed */}
        <div className="glassy-card" style={{ display: 'flex', flexDirection: 'column', maxHeight: '70vh' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} /> Global Live Feed
          </h3>
          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
            {loading ? <p>Intercepting comms...</p> : globalFeed.map((trade, idx) => (
              <div key={idx} style={{ 
                padding: '12px 0', 
                borderBottom: '1px solid var(--color-card-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: trade.type === 'BUY' ? 'var(--color-jade)' : 'var(--color-rose)' }}>
                    {trade.type} {trade.shares} {trade.symbol}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    by {trade.userEmail.split('@')[0]}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono-text" style={{ fontSize: '0.9rem', color: '#fff' }}>₹{trade.price?.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{trade.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
