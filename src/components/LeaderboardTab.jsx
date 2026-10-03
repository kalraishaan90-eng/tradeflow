import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Trophy, User as UserIcon } from 'lucide-react';

export default function LeaderboardTab() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);
        const usersData = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.portfolio) {
            // Estimate net worth: balance + value of positions at avgBuyPrice (or use history if available)
            let netWorth = data.portfolio.balance;
            if (data.portfolio.positions) {
              netWorth += data.portfolio.positions.reduce((acc, pos) => acc + (pos.shares * pos.avgBuyPrice), 0);
            }
            
            // If we have history, last value is usually most accurate
            if (data.portfolio.history && data.portfolio.history.length > 0) {
              const lastVal = data.portfolio.history[data.portfolio.history.length - 1].value;
              if (lastVal > 0) netWorth = lastVal;
            }

            usersData.push({
              id: doc.id,
              name: data.displayName || 'Anonymous Trader',
              photoURL: data.photoURL,
              netWorth: netWorth,
              trades: data.portfolio.orderHistory ? data.portfolio.orderHistory.length : 0,
              flagged: data.flagged || false
            });
          }
        });

        // Sort descending by netWorth
        usersData.sort((a, b) => b.netWorth - a.netWorth);
        setLeaders(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="tab-panel active" style={{ animation: 'fadeIn 300ms ease-out forwards' }}>
      <div className="section-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Trophy size={28} color="var(--color-gold, #FFD700)" />
        <div>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-header)', fontSize: '1.8rem', fontWeight: '800' }}>Global Leaderboard</h2>
          <span className="section-info">Ranked by simulated net worth</span>
        </div>
      </div>

      <div className="glassy-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
            Loading top traders...
          </div>
        ) : leaders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
            No traders found on the platform yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leaders.map((trader, index) => {
              // Ignore flagged users on the public leaderboard (shadow ban)
              if (trader.flagged) return null;

              let rankColor = 'var(--color-text-secondary)';
              if (index === 0) rankColor = '#FFD700'; // Gold
              if (index === 1) rankColor = '#C0C0C0'; // Silver
              if (index === 2) rankColor = '#CD7F32'; // Bronze

              return (
                <div key={trader.id} className="hover-glow" style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${index < 3 ? rankColor : 'var(--color-card-border)'}`,
                  borderRadius: '12px',
                  gap: '16px',
                  boxShadow: index < 3 ? `0 0 15px ${rankColor}20` : 'none',
                  transition: 'var(--transition-fast)'
                }}>
                  <div style={{ width: '30px', textAlign: 'center', fontWeight: '800', fontSize: '1.2rem', color: rankColor }}>
                    #{index + 1}
                  </div>
                  
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {trader.photoURL ? (
                      <img src={trader.photoURL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <UserIcon size={20} color="var(--color-text-muted)" />
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff' }}>{trader.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{trader.trades} Trades Executed</div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono-text" style={{ fontWeight: '800', fontSize: '1.2rem', color: '#fff' }}>
                      ₹{trader.netWorth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
