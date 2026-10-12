import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  TrendingUp, 
  Grid, 
  Brain, 
  Receipt, 
  User, 
  Zap, 
  PieChart, 
  Bell, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingDown,
  DollarSign,
  LogOut,
  Settings,
  ShieldAlert,
  Trophy,
  Crown
} from 'lucide-react';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useAuth } from './hooks/useAuth';
import AuthScreen from './components/AuthScreen.jsx';
import HomeTab from './components/HomeTab.jsx';
import MarketTab from './components/MarketTab.jsx';
import DashboardTab from './components/DashboardTab.jsx';
import AIInsightsTab from './components/AIInsightsTab.jsx';
import OrdersTab from './components/OrdersTab.jsx';
import SettingsTab from './components/SettingsTab.jsx';
import FOTab from './components/FOTab.jsx';
import MFTab from './components/MFTab.jsx';
import LeaderboardTab from './components/LeaderboardTab.jsx';
import AdminTab from './components/AdminTab.jsx';
import FAQTab from './components/FAQTab.jsx';
import SubscriptionModal from './components/SubscriptionModal.jsx';
import { 
  HelpCircle, 
  BookOpen, 
  Building2, 
  Newspaper, 
  Headphones 
} from 'lucide-react';
import BankingRatesTab from './components/BankingRatesTab.jsx';
import FinanceHubTab from './components/FinanceHubTab.jsx';
import {
  MAX_SIMULATED_CASH,
  STARTING_SIMULATED_CASH,
  clampDepositAmount,
  getAvailableSharesForSell,
  getPendingBuyCommitments,
  isValidTradeInput,
  normalizePortfolio
} from './lib/tradingGuards.mjs';
import { fetchLiveQuotes, mockTick } from './lib/marketData.js';
import {
  loadStoredPortfolio,
  saveStoredPortfolio,
  loadStoredKyc,
  saveStoredKyc,
  loadStoredPlan,
  saveStoredPlan,
  loadStoredGuestSession,
  saveStoredGuestSession
} from './lib/storage.js';

// Initial Mock Assets Data
const INITIAL_WATCHLIST = [
  // Indian Equities (NSE)
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 1167.70, changePercent: -1.63, type: 'Stock', sparkline: [1180, 1175, 1170, 1165, 1168, 1167.70] },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: 2075.00, changePercent: 1.19, type: 'Stock', sparkline: [2045, 2050, 2060, 2070, 2072, 2075] },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', price: 721.20, changePercent: 1.76, type: 'Stock', sparkline: [705, 710, 712, 715, 718, 721.20] },
  { symbol: 'INFY.NS', name: 'Infosys Ltd.', price: 1035.00, changePercent: 4.11, type: 'Stock', sparkline: [995, 1005, 1015, 1025, 1030, 1035] },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', price: 1310.60, changePercent: -0.84, type: 'Stock', sparkline: [1325, 1320, 1315, 1312, 1314, 1310.60] },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', price: 1836.00, changePercent: -2.29, type: 'Stock', sparkline: [1860, 1855, 1845, 1840, 1838, 1836.00] },
  { symbol: 'ITC.NS', name: 'ITC Ltd.', price: 255.90, changePercent: -2.61, type: 'Stock', sparkline: [262, 260, 258, 257, 256, 255.90] },
  { symbol: 'SBIN.NS', name: 'State Bank of India', price: 954.10, changePercent: -0.56, type: 'Stock', sparkline: [960, 958, 955, 952, 953, 954.10] },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', price: 1720.00, changePercent: 1.25, type: 'Stock', sparkline: [1695, 1700, 1708, 1712, 1715, 1720] },
  { symbol: 'LT.NS', name: 'Larsen & Toubro', price: 3480.00, changePercent: 0.88, type: 'Stock', sparkline: [3440, 3450, 3465, 3470, 3475, 3480] },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', price: 812.50, changePercent: -1.15, type: 'Stock', sparkline: [825, 822, 818, 816, 814, 812.5] },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical', price: 1890.00, changePercent: 0.64, type: 'Stock', sparkline: [1870, 1878, 1880, 1884, 1888, 1890] },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', price: 7150.00, changePercent: 1.45, type: 'Stock', sparkline: [7020, 7060, 7090, 7120, 7140, 7150] },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints', price: 2420.00, changePercent: -0.42, type: 'Stock', sparkline: [2435, 2430, 2428, 2425, 2422, 2420] },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India', price: 11850.00, changePercent: 0.92, type: 'Stock', sparkline: [11700, 11750, 11790, 11810, 11830, 11850] },
  { symbol: 'TITAN.NS', name: 'Titan Company', price: 3260.00, changePercent: -0.75, type: 'Stock', sparkline: [3290, 3280, 3275, 3270, 3265, 3260] },
  { symbol: 'M&M.NS', name: 'Mahindra & Mahindra', price: 2840.00, changePercent: 2.10, type: 'Stock', sparkline: [2760, 2780, 2800, 2815, 2830, 2840] },
  { symbol: 'ADANIENT.NS', name: 'Adani Enterprises', price: 2410.00, changePercent: -1.80, type: 'Stock', sparkline: [2460, 2445, 2430, 2425, 2418, 2410] },
  { symbol: 'WIPRO.NS', name: 'Wipro Ltd.', price: 565.00, changePercent: 0.35, type: 'Stock', sparkline: [561, 562, 563, 564, 564.5, 565] },
  { symbol: 'ZOMATO.NS', name: 'Zomato Ltd.', price: 275.50, changePercent: 3.20, type: 'Stock', sparkline: [265, 268, 270, 272, 274, 275.5] },
  { symbol: 'JIOFIN.NS', name: 'Jio Financial Services', price: 315.00, changePercent: 1.10, type: 'Stock', sparkline: [310, 311, 312, 313, 314, 315] },
  { symbol: 'NTPC.NS', name: 'NTPC Ltd.', price: 395.00, changePercent: 0.50, type: 'Stock', sparkline: [391, 392, 393, 394, 394.5, 395] },
  { symbol: 'NIFTY50', name: 'Nifty 50 Index', price: 24850.00, changePercent: 0.65, type: 'Index', sparkline: [24600, 24650, 24700, 24750, 24800, 24850] },

  // Crypto
  { symbol: 'BTC', name: 'Bitcoin', price: 84516.00, changePercent: -2.44, type: 'Crypto', sparkline: [85500, 85200, 84900, 84600, 84550, 84516] },
  { symbol: 'ETH', name: 'Ethereum', price: 2673.70, changePercent: -2.48, type: 'Crypto', sparkline: [2740, 2720, 2700, 2685, 2678, 2673.70] },
  { symbol: 'SOL', name: 'Solana', price: 119.00, changePercent: -3.60, type: 'Crypto', sparkline: [123, 122, 121, 120, 119.5, 119.00] },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.1650, changePercent: -1.20, type: 'Crypto', sparkline: [0.168, 0.167, 0.166, 0.165, 0.165, 0.1650] },
  { symbol: 'ADA', name: 'Cardano', price: 0.4250, changePercent: -0.85, type: 'Crypto', sparkline: [0.43, 0.428, 0.427, 0.426, 0.425, 0.4250] },
  { symbol: 'BNB', name: 'BNB', price: 625.00, changePercent: -1.10, type: 'Crypto', sparkline: [632, 630, 628, 626, 625.5, 625.00] },

  // Forex
  { symbol: 'USDINR=X', name: 'USD / Indian Rupee', price: 96.30, changePercent: -0.01, type: 'Forex', sparkline: [96.35, 96.33, 96.32, 96.31, 96.30, 96.30] },
  { symbol: 'GBPINR=X', name: 'GBP / Indian Rupee', price: 127.51, changePercent: 0.37, type: 'Forex', sparkline: [126.8, 127.0, 127.2, 127.3, 127.4, 127.51] },
  { symbol: 'EURINR=X', name: 'EUR / Indian Rupee', price: 108.35, changePercent: 0.02, type: 'Forex', sparkline: [108.3, 108.32, 108.34, 108.33, 108.35, 108.35] },
  { symbol: 'JPYINR=X', name: 'JPY / Indian Rupee', price: 0.6340, changePercent: -0.15, type: 'Forex', sparkline: [0.635, 0.635, 0.634, 0.634, 0.634, 0.6340] },
  { symbol: 'EURUSD=X', name: 'EUR / USD', price: 1.1257, changePercent: 0.11, type: 'Forex', sparkline: [1.124, 1.125, 1.125, 1.126, 1.1255, 1.1257] },
  { symbol: 'GBPUSD=X', name: 'GBP / USD', price: 1.3240, changePercent: 0.35, type: 'Forex', sparkline: [1.32, 1.321, 1.322, 1.323, 1.324, 1.3240] },
];

// Initial Portfolio state
const INITIAL_PORTFOLIO = {
  balance: STARTING_SIMULATED_CASH,
  positions: [],
  totalPnL: 0,
  realizedPnL: 0,
  todayPnL: 0,
  todayPnLPercent: 0,
  history: [
    { value: 8000000 }
  ],
  orders: [],
  orderHistory: [],
  cashDeposited: 0,
  leaderboardEligible: true
};

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);

function App() {
  const { user, loading, error: authError, signInWithGoogle, signInWithGitHub, signOut } = useAuth();

  const [isGuest, setIsGuest] = useState(() => loadStoredGuestSession());
  const [activeTab, setActiveTab] = useState('home');
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState('BTC');
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST);
  const [portfolio, setPortfolio] = useState(() => loadStoredPortfolio(INITIAL_PORTFOLIO));
  const [kycCompleted, setKycCompleted] = useState(() => loadStoredKyc());
  const [userPlan, setUserPlan] = useState(() => loadStoredPlan());
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [timeStr, setTimeStr] = useState('');

  const watchlistRef = useRef(watchlist);
  watchlistRef.current = watchlist;

  const portfolioRef = useRef(portfolio);
  portfolioRef.current = portfolio;

  const kycCompletedRef = useRef(kycCompleted);
  kycCompletedRef.current = kycCompleted;

  const resetSessionData = () => {
    setPortfolio(INITIAL_PORTFOLIO);
    saveStoredPortfolio(INITIAL_PORTFOLIO);
    setKycCompleted(false);
    saveStoredKyc(false);
    kycCompletedRef.current = false;
    setNotifications([]);
    setActiveTab('home');
  };

  const startGuestSession = () => {
    saveStoredGuestSession(true);
    setIsGuest(true);
  };

  const endGuestSession = () => {
    saveStoredGuestSession(false);
    setIsGuest(false);
    resetSessionData();
  };

  // Firebase DB Sync helper
  const savePortfolioToDB = async (newPortfolio, kycOverride) => {
    if (!user) return;
    try {
      const safePortfolio = normalizePortfolio(newPortfolio, INITIAL_PORTFOLIO);
      await setDoc(doc(db, 'users', user.uid), {
        displayName: user.displayName || 'Guest Trader',
        email: user.email,
        photoURL: user.photoURL || '',
        portfolio: safePortfolio,
        kycCompleted: kycOverride !== undefined ? kycOverride : kycCompletedRef.current,
        plan: userPlan,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.error("Error saving portfolio to DB", e);
    }
  };

  const commitPortfolio = (nextPortfolio) => {
    const safePortfolio = normalizePortfolio(nextPortfolio, INITIAL_PORTFOLIO);
    setPortfolio(safePortfolio);
    saveStoredPortfolio(safePortfolio);
    savePortfolioToDB(safePortfolio);
    return safePortfolio;
  };

  const updateKycStatus = async (status) => {
    setKycCompleted(status);
    kycCompletedRef.current = status;
    saveStoredKyc(status);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          kycCompleted: status,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.error("Error saving KYC to DB", e);
      }
    }
  };

  const handleSelectPlan = async (plan) => {
    setUserPlan(plan);
    saveStoredPlan(plan);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          plan,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.error("Error saving subscription plan to DB", e);
      }
    }
  };

  // Fetch data on login
  useEffect(() => {
    if (!user) return;
    saveStoredGuestSession(false);
    setIsGuest(false);
    const fetchUserData = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.portfolio) {
          const merged = normalizePortfolio(data.portfolio, INITIAL_PORTFOLIO);
          setPortfolio(merged);
          saveStoredPortfolio(merged);
        }
        if (data.kycCompleted !== undefined) {
          setKycCompleted(data.kycCompleted);
          saveStoredKyc(data.kycCompleted);
        }
        if (data.plan) {
          setUserPlan(data.plan);
          saveStoredPlan(data.plan);
        }
      } else {
        // Initialize in DB
        commitPortfolio(INITIAL_PORTFOLIO);
      }
    };
    fetchUserData();
  }, [user]);

  // Clock ticks
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live Price Ticks & Limit Order Matcher
  useEffect(() => {
    let realPrices = {};

    const fetchRealData = async () => {
      const typeMap = {};
      watchlistRef.current.forEach(a => { typeMap[a.symbol] = a.type; });
      const symbols = watchlistRef.current.map(a => a.symbol);
      const quotes = await fetchLiveQuotes(symbols, typeMap);
      realPrices = quotes;

      // Merge real prices into watchlist
      if (Object.keys(quotes).length > 0) {
        setWatchlist(prev => prev.map(asset => {
          const q = quotes[asset.symbol];
          if (!q) return asset;
          const newPrice = q.price;
          const newChange = q.changePercent;
          const newSparkline = [...asset.sparkline.slice(1), newPrice];
          return {
            ...asset,
            price: parseFloat(newPrice.toFixed(asset.type === 'Forex' ? 4 : 2)),
            changePercent: parseFloat(newChange.toFixed(2)),
            sparkline: newSparkline,
          };
        }));
      }
    };

    // Initial fetch
    fetchRealData();

    const tickMarkets = () => {
      const nextWatchlist = watchlistRef.current.map(asset => {
        const q = realPrices[asset.symbol];
        // If we have real price, micro-tick around it for visual life; otherwise use mock walk
        const base = q ? q.price : asset.price;
        const volatility = asset.type === 'Crypto' ? 0.0008 : asset.type === 'Stock' ? 0.0003 : 0.00008;
        const changePercent = (Math.random() - 0.5) * volatility;
        const newPrice = base * (1 + changePercent);
        const newChange = asset.changePercent + (changePercent * 100);
        const newSparkline = [...asset.sparkline.slice(1), newPrice];
        return {
          ...asset,
          price: parseFloat(newPrice.toFixed(asset.type === 'Forex' ? 4 : 2)),
          changePercent: parseFloat(newChange.toFixed(2)),
          sparkline: newSparkline
        };
      });

      setWatchlist(nextWatchlist);

      // Check and match limit orders
      const currentPortfolio = portfolioRef.current;
      if (currentPortfolio.orders.length > 0) {
        const remainingOrders = [];
        let updatedBalance = currentPortfolio.balance;
        const nextPositions = [...currentPortfolio.positions];
        const nextOrderHistory = [...currentPortfolio.orderHistory];
        let orderMatched = false;

        currentPortfolio.orders.forEach(order => {
          const matchedAsset = nextWatchlist.find(a => a.symbol === order.symbol);
          if (!matchedAsset) {
            remainingOrders.push(order);
            return;
          }

          const currentPrice = matchedAsset.price;
          let triggers = false;

          if (order.type === 'BUY' && currentPrice <= order.price) {
            triggers = true;
          } else if (order.type === 'SELL' && currentPrice >= order.price) {
            triggers = true;
          }

          if (triggers) {
            orderMatched = true;
            const cost = currentPrice * order.shares;
            let orderStatus = 'FILLED';
            
            if (order.type === 'BUY') {
              if (cost > updatedBalance) {
                orderStatus = 'REJECTED';
              } else {
                updatedBalance -= cost;
                const existIdx = nextPositions.findIndex(p => p.symbol === order.symbol);
                if (existIdx >= 0) {
                  const existing = nextPositions[existIdx];
                  const totalShares = existing.shares + order.shares;
                  const newAvg = ((existing.shares * existing.avgBuyPrice) + cost) / totalShares;
                  nextPositions[existIdx] = {
                    ...existing,
                    shares: totalShares,
                    avgBuyPrice: parseFloat(newAvg.toFixed(2))
                  };
                } else {
                  nextPositions.push({
                    symbol: order.symbol,
                    shares: order.shares,
                    avgBuyPrice: currentPrice
                  });
                }
              }
            } else {
              // Sell order
              const existIdx = nextPositions.findIndex(p => p.symbol === order.symbol);
              if (existIdx >= 0) {
                const existing = nextPositions[existIdx];
                if (existing.shares >= order.shares) {
                  const remainingShares = existing.shares - order.shares;
                  updatedBalance += cost;
                  if (remainingShares > 0) {
                    nextPositions[existIdx] = {
                      ...existing,
                      shares: remainingShares
                    };
                  } else {
                    nextPositions.splice(existIdx, 1);
                  }
                } else {
                  orderStatus = 'REJECTED';
                }
              } else {
                orderStatus = 'REJECTED';
              }
            }

            // Record completed order
            nextOrderHistory.push({
              ...order,
              price: currentPrice,
              status: orderStatus,
              timestamp: new Date().toLocaleTimeString()
            });

            // Trigger notification
            setNotifications(prev => [
              {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                message: orderStatus === 'FILLED'
                  ? `Limit ${order.type} filled: ${order.shares} ${order.symbol} @ $${currentPrice.toFixed(2)}`
                  : `Limit ${order.type} rejected: ${order.symbol} no longer has enough simulated cash/holdings`,
                timestamp: new Date().toLocaleTimeString()
              },
              ...prev
            ]);
          } else {
            remainingOrders.push(order);
          }
        });

        if (orderMatched) {
          const newPortfolio = {
            ...currentPortfolio,
            balance: parseFloat(updatedBalance.toFixed(2)),
            positions: nextPositions,
            orders: remainingOrders,
            orderHistory: nextOrderHistory
          };
          commitPortfolio(newPortfolio);
        }
      }
    };

    const tickInterval = setInterval(tickMarkets, 2000);
    const fetchInterval = setInterval(fetchRealData, 10000);
    return () => {
      clearInterval(tickInterval);
      clearInterval(fetchInterval);
    };
  }, []);

  // Update today's P&L periodically based on live asset prices
  useEffect(() => {
    const currentPortfolio = portfolioRef.current;
    const currentWatchlist = watchlistRef.current;

    // Calculate value of current holdings
    const positionsValue = currentPortfolio.positions.reduce((acc, pos) => {
      const asset = currentWatchlist.find(w => w.symbol === pos.symbol);
      const curPrice = asset ? asset.price : pos.avgBuyPrice;
      return acc + (curPrice * pos.shares);
    }, 0);

    const netWorth = currentPortfolio.balance + positionsValue;
    const startingWorth = 8000000;
    const totalPnL = netWorth - startingWorth;

    // Mock today PnL fluctuations
    const mockTodayPnL = totalPnL; // simplified mapping
    const mockTodayPnLPercent = (mockTodayPnL / startingWorth) * 100;

    // Append to portfolio net worth history occasionally (every 10s or on update)
    setPortfolio(prev => {
      const nextHistory = [...prev.history];
      if (nextHistory.length > 30) nextHistory.shift();
      
      // Update entry
      const last = nextHistory[nextHistory.length - 1];
      if (!last || Math.abs(last.value - netWorth) > 5) {
        nextHistory.push({ value: parseFloat(netWorth.toFixed(2)) });
      } else {
        nextHistory[nextHistory.length - 1] = { value: parseFloat(netWorth.toFixed(2)) };
      }

      return {
        ...prev,
        totalPnL: parseFloat(totalPnL.toFixed(2)),
        todayPnL: parseFloat(mockTodayPnL.toFixed(2)),
        todayPnLPercent: parseFloat(mockTodayPnLPercent.toFixed(2)),
        history: nextHistory
      };
    });

  }, [watchlist]);

  // Execute buy/sell trade
  const executeTrade = (symbol, type, qty, price, orderStyle = 'Market') => {
    const normalizedQty = Number(qty);
    let normalizedPrice = Number(price);

    // Security fix: For market orders, always pull the real-time live price 
    // instead of trusting the client-provided price.
    if (orderStyle === 'Market') {
      const asset = watchlistRef.current.find(a => a.symbol === symbol);
      if (asset) {
        normalizedPrice = asset.price;
      }
    }

    if (!isValidTradeInput(normalizedQty, normalizedPrice)) {
      alert("Enter a valid positive whole-number quantity and price.");
      return false;
    }

    const cost = normalizedQty * normalizedPrice;
    const nextPositions = [...portfolio.positions];
    const nextOrderHistory = [...portfolio.orderHistory];
    const orderId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (type === 'BUY') {
      if (cost > portfolio.balance) {
        alert("Insufficient simulated buying power.");
        return false;
      }

      if (orderStyle === 'Limit') {
        const committedCash = getPendingBuyCommitments(portfolio);
        if (committedCash + cost > portfolio.balance) {
          alert("This limit order would exceed your unreserved simulated cash.");
          return false;
        }

        commitPortfolio({
          ...portfolio,
          orders: [
            ...portfolio.orders,
            {
              id: orderId,
              symbol,
              type,
              shares: normalizedQty,
              price: normalizedPrice,
              orderType: orderStyle
            }
          ]
        });
        return true;
      }

      // Execute Market Order immediately
      const existIdx = nextPositions.findIndex(p => p.symbol === symbol);
      if (existIdx >= 0) {
        const existing = nextPositions[existIdx];
        const totalShares = existing.shares + normalizedQty;
        const newAvg = ((existing.shares * existing.avgBuyPrice) + cost) / totalShares;
        nextPositions[existIdx] = {
          ...existing,
          shares: totalShares,
          avgBuyPrice: parseFloat(newAvg.toFixed(2))
        };
      } else {
        nextPositions.push({
          symbol,
          shares: normalizedQty,
          avgBuyPrice: normalizedPrice
        });
      }

      nextOrderHistory.push({
        id: orderId,
        timestamp: new Date().toLocaleTimeString(),
        symbol,
        type,
        shares: normalizedQty,
        price: normalizedPrice,
        status: 'FILLED'
      });

      const newPortfolio = {
        ...portfolio,
        balance: parseFloat((portfolio.balance - cost).toFixed(2)),
        positions: nextPositions,
        orderHistory: nextOrderHistory
      };
      commitPortfolio(newPortfolio);

      return true;
    } else {
      // SELL trade
      const existIdx = nextPositions.findIndex(p => p.symbol === symbol);
      if (existIdx < 0 || nextPositions[existIdx].shares < normalizedQty) {
        alert("You do not hold enough shares/contracts of this asset to sell.");
        return false;
      }

      if (orderStyle === 'Limit') {
        if (getAvailableSharesForSell(portfolio, symbol) < normalizedQty) {
          alert("This limit order would exceed your unreserved simulated holdings.");
          return false;
        }

        commitPortfolio({
          ...portfolio,
          orders: [
            ...portfolio.orders,
            {
              id: orderId,
              symbol,
              type,
              shares: normalizedQty,
              price: normalizedPrice,
              orderType: orderStyle
            }
          ]
        });
        return true;
      }

      // Execute Market Sell
      const existing = nextPositions[existIdx];
      const remainingShares = existing.shares - normalizedQty;
      const tradeRealizedPnL = (normalizedPrice - existing.avgBuyPrice) * normalizedQty;
      if (remainingShares > 0) {
        nextPositions[existIdx] = {
          ...existing,
          shares: remainingShares
        };
      } else {
        nextPositions.splice(existIdx, 1);
      }

      nextOrderHistory.push({
        id: orderId,
        timestamp: new Date().toLocaleTimeString(),
        symbol,
        type,
        shares: normalizedQty,
        price: normalizedPrice,
        status: 'FILLED',
        realizedPnL: parseFloat(tradeRealizedPnL.toFixed(2))
      });

      const newPortfolio = {
        ...portfolio,
        balance: parseFloat((portfolio.balance + cost).toFixed(2)),
        positions: nextPositions,
        orderHistory: nextOrderHistory,
        realizedPnL: parseFloat((portfolio.realizedPnL + tradeRealizedPnL).toFixed(2))
      };
      commitPortfolio(newPortfolio);

      return true;
    }
  };

  // Cancel pending limit order
  const cancelOrder = (orderId) => {
    const orderToCancel = portfolio.orders.find(o => o.id === orderId);
    if (!orderToCancel) return;

    const newPortfolio = {
      ...portfolio,
      orders: portfolio.orders.filter(o => o.id !== orderId),
      orderHistory: [
        {
          ...orderToCancel,
          status: 'CANCELLED',
          timestamp: new Date().toLocaleTimeString()
        },
        ...portfolio.orderHistory
      ]
    };
    commitPortfolio(newPortfolio);
  };

  const depositSimulatedCash = (amount) => {
    if (userPlan === 'free') {
      setIsUpgradeModalOpen(true);
      return false;
    }

    const requested = clampDepositAmount(amount);
    const allowed = Math.min(requested, Math.max(0, MAX_SIMULATED_CASH - portfolio.balance));

    if (allowed <= 0) {
      alert(`Practice cash is capped at ₹${MAX_SIMULATED_CASH.toLocaleString('en-IN')}. Reset the simulator for a fresh ranked account.`);
      return false;
    }

    const newPortfolio = {
      ...portfolio,
      balance: portfolio.balance + allowed,
      cashDeposited: (portfolio.cashDeposited || 0) + allowed,
      leaderboardEligible: false
    };
    commitPortfolio(newPortfolio);
    return allowed;
  };

  const resetPortfolio = () => {
    commitPortfolio(INITIAL_PORTFOLIO);
    setNotifications([]);
  };

  // Active P&L formatting
  const todayPnL = portfolio.todayPnL;
  const isPnLPositive = todayPnL >= 0;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'market', label: 'Market', icon: TrendingUp },
    { id: 'dashboard', label: 'Dashboard', icon: Grid },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain },
    { id: 'orders', label: 'Orders', icon: Receipt },
    { id: 'fo', label: 'F&O', icon: Zap },
    { id: 'mutual-funds', label: 'Mutual Funds', icon: PieChart },
    { id: 'finance-hub', label: 'Finance Hub', icon: BookOpen },
    { id: 'banking-rates', label: 'Banking & Yields', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'faq', label: 'FAQ', icon: HelpCircle }
  ];

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldAlert });
  }

  // Auth gate: show loading or auth screen if not signed in
  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-logo">
          <TrendingUp size={28} />
        </div>
        <span className="auth-loading-text">Loading TradeFlow...</span>
      </div>
    );
  }

  if (!user && !isGuest) {
    return (
      <AuthScreen
        onGoogleSignIn={signInWithGoogle}
        onGitHubSignIn={signInWithGitHub}
        onContinueAsGuest={startGuestSession}
        error={authError}
      />
    );
  }

  // Derive display values from Firebase user
  const displayName = isGuest ? 'Guest Trader' : user.displayName || user.email?.split('@')[0] || 'Trader';
  const userInitial = displayName.charAt(0).toUpperCase();
  const userAvatar = isGuest ? null : user.photoURL;

  return (
    <div className="app-container">
      {/* Desktop Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <TrendingUp className="logo-icon" />
          <span className="logo-text">Trade<span>Flow</span></span>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                className={`nav-item hover-glow ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-summary">
            {userAvatar ? (
              <img src={userAvatar} alt="" className="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div className="avatar">
                {userInitial}
              </div>
            )}
            <div className="user-details">
              <p className="user-name">{displayName}</p>
              <p className="user-status">
                <span className="status-dot"></span>
                {kycCompleted ? 'KYC VERIFIED ✓' : 'SHADOW TRADER'}
              </p>
            </div>
            <button
              onClick={isGuest ? endGuestSession : signOut}
              title={isGuest ? 'Exit trial session' : 'Sign out'}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: '4px',
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-rose)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="main-content">
        {/* Global Header */}
        <header className="content-header">
          <div className="header-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp className="logo-icon" style={{ fontSize: '20px', width: '24px', height: '24px' }} />
              <h1 className="greeting-text">TradeFlow</h1>
              <span className="badge-interactive" style={{ backgroundColor: 'rgba(93, 211, 148, 0.08)', color: 'var(--color-jade)' }}>
                Practice Mode
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', color: 'var(--color-text-secondary)', fontSize: '11px' }}>
              <Clock size={12} />
              <span className="mono-text">{timeStr}</span>
            </div>
          </div>

          <div className="header-right">
            {/* Subscription Tier Button */}
            <button 
              onClick={() => setIsUpgradeModalOpen(true)}
              className="trade-btn hover-glow"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                border: userPlan === 'free' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(56, 189, 248, 0.6)',
                background: userPlan === 'free' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(56, 189, 248, 0.15)',
                color: userPlan === 'free' ? '#fbbf24' : '#38bdf8',
                cursor: 'pointer'
              }}
              title="View Subscription Plans"
            >
              <Crown size={14} />
              <span>{userPlan === 'free' ? 'Free plan · Upgrade' : `${userPlan.toUpperCase()} Plan`}</span>
            </button>

            {/* Real-time cycling ticker */}
            <div className="pl-ticker-container">
              <span className="pl-ticker-label">Today's P&L</span>
              <span className={`pl-ticker-value mono-text ${isPnLPositive ? 'trend-up' : 'trend-down'}`}>
                {isPnLPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {isPnLPositive ? '+' : ''}{portfolio.todayPnLPercent.toFixed(2)}%
              </span>
            </div>

            {/* Buying power widget */}
            <div className="sim-balance-widget">
              <span className="sim-balance-label">Cash</span>
              <span className="sim-balance-amount mono-text">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(portfolio.balance)}
              </span>
            </div>

            {isGuest && (
              <button
                className="trade-btn secondary-btn hover-glow"
                style={{ padding: '8px', borderRadius: '50%' }}
                aria-label="Exit trial session"
                title="Exit trial session"
                onClick={endGuestSession}
              >
                <LogOut size={18} />
              </button>
            )}

            {/* Notification bell */}
            <button 
              className="trade-btn secondary-btn hover-glow" 
              style={{ padding: '8px', borderRadius: '50%', position: 'relative' }}
              aria-label={`Notifications${notifications.length > 0 ? ` (${notifications.length} unread)` : ''}`}
              onClick={() => {
                if (notifications.length > 0) {
                  alert(`Simulator Notifications:\n\n${notifications.map(n => `[${n.timestamp}] ${n.message}`).join('\n')}`);
                } else {
                  alert("No active notification signals.");
                }
              }}
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '2px', 
                  right: '2px', 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-rose)' 
                }}></span>
              )}
            </button>
          </div>
        </header>

        {/* Tab Panes Wrapper */}
        <div className="tab-panels">
          {activeTab === 'home' && (
            <HomeTab 
              portfolio={portfolio} 
              watchlist={watchlist} 
              setActiveTab={setActiveTab} 
              setSelectedAssetSymbol={setSelectedAssetSymbol}
              depositSimulatedCash={depositSimulatedCash}
              userPlan={userPlan}
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
            />
          )}

          {activeTab === 'market' && (
            <MarketTab 
              watchlist={watchlist} 
              portfolio={portfolio} 
              executeTrade={executeTrade}
              selectedAssetSymbol={selectedAssetSymbol}
              setSelectedAssetSymbol={setSelectedAssetSymbol}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardTab portfolio={portfolio} watchlist={watchlist} />
          )}

          {activeTab === 'ai-insights' && (
            <AIInsightsTab 
              watchlist={watchlist} 
              setActiveTab={setActiveTab} 
              setSelectedAssetSymbol={setSelectedAssetSymbol}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab 
              portfolio={portfolio} 
              watchlist={watchlist} 
              cancelOrder={cancelOrder}
              executeTrade={executeTrade}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab 
              kycCompleted={kycCompleted} 
              setKycCompleted={updateKycStatus} 
              resetPortfolio={resetPortfolio}
              portfolio={portfolio}
              userDisplayName={displayName}
              userPlan={userPlan}
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
            />
          )}

          {activeTab === 'fo' && (
            <FOTab 
              watchlist={watchlist}
              portfolio={portfolio} 
              executeTrade={executeTrade} 
              kycCompleted={kycCompleted} 
              setKycCompleted={updateKycStatus}
              setActiveTab={setActiveTab} 
            />
          )}

          {activeTab === 'mutual-funds' && (
            <MFTab 
              portfolio={portfolio} 
              executeTrade={executeTrade} 
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardTab />
          )}

          {(activeTab === 'finance-hub' || activeTab === 'dictionary' || activeTab === 'news' || activeTab === 'wealth' || activeTab === 'comparison') && (
            <FinanceHubTab setActiveTab={setActiveTab} />
          )}

          {activeTab === 'banking-rates' && (
            <BankingRatesTab setActiveTab={setActiveTab} />
          )}

          {activeTab === 'faq' && (
            <FAQTab />
          )}

          {activeTab === 'admin' && isAdmin && (
            <AdminTab />
          )}
        </div>
      </main>

      <nav className="bottom-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button 
              key={item.id}
              className={`bottom-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
        currentPlan={userPlan} 
        onSelectPlan={handleSelectPlan} 
      />
    </div>
  );
}

export default App;
