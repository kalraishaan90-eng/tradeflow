import React, { useState, useRef } from 'react';
import {
  Clock, CheckCircle, XCircle, Trash2, TrendingUp, TrendingDown,
  BarChart2, AlertCircle, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { formatINR } from '../lib/format.mjs';

// Swipeable row component for mobile cancel gesture
function SwipeableOrderRow({ order, onCancel, formatCurrency }) {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiped, setIsSwiped] = useState(false);
  const startX = useRef(null);
  const rowRef = useRef(null);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    if (dx < 0) {
      setTranslateX(Math.max(dx, -90));
    } else if (isSwiped) {
      setTranslateX(Math.min(dx - 90, 0));
    }
  };

  const handleTouchEnd = () => {
    if (translateX < -50) {
      setTranslateX(-90);
      setIsSwiped(true);
    } else {
      setTranslateX(0);
      setIsSwiped(false);
    }
    startX.current = null;
  };

  return (
    <div className="swipe-row-wrapper" ref={rowRef}>
      {/* Red Cancel Reveal Layer */}
      <div className="swipe-cancel-reveal">
        <button
          className="swipe-cancel-btn"
          onClick={() => onCancel(order.id)}
          aria-label="Cancel order"
        >
          <Trash2 size={18} />
          <span>Cancel</span>
        </button>
      </div>

      {/* Main Row Content */}
      <div
        className="swipe-row-content"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="open-order-row">
          <div className="oor-asset">
            <span className="mono-text" style={{ fontWeight: 700, fontSize: '14px' }}>{order.symbol}</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Limit Order</span>
          </div>
          <div>
            <span className={`status-chip ${order.type === 'BUY' ? 'chip-buy' : 'chip-sell'}`}>
              {order.type}
            </span>
          </div>
          <div className="mono-text" style={{ textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>
            {order.shares} <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>qty</span>
          </div>
          <div className="mono-text" style={{ textAlign: 'right', fontSize: '13px', fontWeight: 600 }}>
            {formatCurrency(order.price)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* Desktop cancel button only */}
            <button
              className="cancel-order-btn desktop-only"
              onClick={() => onCancel(order.id)}
              title="Cancel Order"
            >
              <Trash2 size={14} /> Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersTab({ portfolio, watchlist, cancelOrder }) {
  const { orders, orderHistory, positions = [] } = portfolio;
  const [activeSubTab, setActiveSubTab] = useState('positions');
  const [sortBy, setSortBy] = useState('pnl');
  const [expandedRow, setExpandedRow] = useState(null);

  const fmt = (val) => formatINR(val);

  // Compute live positions with P&L
  const livePositions = positions.map(pos => {
    const asset = watchlist.find(w => w.symbol === pos.symbol);
    const currentPrice = asset ? asset.price : pos.avgBuyPrice;
    const pnl = (currentPrice - pos.avgBuyPrice) * pos.shares;
    const pnlPercent = ((currentPrice - pos.avgBuyPrice) / pos.avgBuyPrice) * 100;
    const value = currentPrice * pos.shares;
    return { ...pos, currentPrice, pnl, pnlPercent, value };
  });

  const sortedPositions = [...livePositions].sort((a, b) => {
    if (sortBy === 'pnl') return b.pnl - a.pnl;
    if (sortBy === 'value') return b.value - a.value;
    if (sortBy === 'symbol') return a.symbol.localeCompare(b.symbol);
    return 0;
  });

  const totalPnL = livePositions.reduce((sum, p) => sum + p.pnl, 0);
  const totalValue = livePositions.reduce((sum, p) => sum + p.value, 0);

  const getStatusChipClass = (status) => {
    if (status === 'FILLED') return 'chip-executed';
    if (status === 'CANCELLED') return 'chip-cancelled';
    return 'chip-pending';
  };

  const subTabs = [
    { id: 'positions', label: 'Open Positions', count: livePositions.length },
    { id: 'open-orders', label: 'Pending Orders', count: orders.length },
    { id: 'history', label: 'Order History', count: orderHistory.length },
  ];

  return (
    <div className="orders-layout">
      {/* Summary Banner */}
      <div className="orders-summary-banner glassy-card">
        <div className="orders-summary-item">
          <span className="summary-label">Portfolio Invested</span>
          <span className="mono-text summary-value">{fmt(totalValue)}</span>
        </div>
        <div className="orders-summary-divider" />
        <div className="orders-summary-item">
          <span className="summary-label">Unrealized P&amp;L</span>
          <span className={`mono-text summary-value ${totalPnL >= 0 ? 'trend-up' : 'trend-down'}`}>
            {totalPnL >= 0 ? '+' : ''}{fmt(totalPnL)}
          </span>
        </div>
        <div className="orders-summary-divider" />
        <div className="orders-summary-item">
          <span className="summary-label">Open Positions</span>
          <span className="mono-text summary-value">{livePositions.length}</span>
        </div>
        <div className="orders-summary-divider" />
        <div className="orders-summary-item">
          <span className="summary-label">Pending Orders</span>
          <span className="mono-text summary-value">{orders.length}</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="orders-sub-tabs">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            className={`orders-sub-tab ${activeSubTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count-pill">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ======= Open Positions Table ======= */}
      {activeSubTab === 'positions' && (
        <div className="glassy-card orders-table-card">
          <div className="orders-table-header">
            <h3 className="card-title" style={{ fontSize: '16px' }}>Open Positions</h3>
            <div className="sort-controls">
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Sort by:</span>
              {[['pnl', 'P&L'], ['value', 'Value'], ['symbol', 'Symbol']].map(([key, label]) => (
                <button
                  key={key}
                  className={`sort-chip ${sortBy === key ? 'active' : ''}`}
                  onClick={() => setSortBy(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {livePositions.length === 0 ? (
            <div className="empty-state">
              <BarChart2 size={40} strokeWidth={1} />
              <p>No open positions yet</p>
              <span>Execute a trade to see your positions here</span>
            </div>
          ) : (
            <div className="positions-table-wrapper">
              <table className="positions-table">
                <thead>
                  <tr>
                    <th>Stock</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Avg Price</th>
                    <th className="text-right">Current</th>
                    <th className="text-right">Value</th>
                    <th className="text-right">P&amp;L</th>
                    <th className="text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPositions.map((pos, idx) => {
                    const isExpanded = expandedRow === pos.symbol;
                    const isPos = pos.pnl >= 0;
                    return (
                      <React.Fragment key={pos.symbol}>
                        <tr
                          className={`positions-row ${isExpanded ? 'expanded' : ''}`}
                          onClick={() => setExpandedRow(isExpanded ? null : pos.symbol)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div className={`pos-indicator ${isPos ? 'pos-green' : 'pos-red'}`} />
                              <div>
                                <div className="mono-text" style={{ fontWeight: 700, fontSize: '14px' }}>
                                  {pos.symbol}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                  {watchlist.find(w => w.symbol === pos.symbol)?.name || ''}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="mono-text text-right">{pos.shares}</td>
                          <td className="mono-text text-right">{fmt(pos.avgBuyPrice)}</td>
                          <td className="mono-text text-right">{fmt(pos.currentPrice)}</td>
                          <td className="mono-text text-right">{fmt(pos.value)}</td>
                          <td className={`mono-text text-right ${isPos ? 'trend-up' : 'trend-down'}`}>
                            {isPos ? '+' : ''}{fmt(pos.pnl)}
                          </td>
                          <td>
                            <div className={`pnl-badge ${isPos ? 'pnl-badge-pos' : 'pnl-badge-neg'}`}>
                              {isPos ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                              {Math.abs(pos.pnlPercent).toFixed(2)}%
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="positions-row-expanded">
                            <td colSpan={7}>
                              <div className="expanded-pos-details">
                                <div className="exp-stat">
                                  <span>Cost Basis</span>
                                  <strong className="mono-text">{fmt(pos.avgBuyPrice * pos.shares)}</strong>
                                </div>
                                <div className="exp-stat">
                                  <span>Unrealized Gain</span>
                                  <strong className={`mono-text ${isPos ? 'trend-up' : 'trend-down'}`}>
                                    {isPos ? '+' : ''}{fmt(pos.pnl)}
                                  </strong>
                                </div>
                                <div className="exp-stat">
                                  <span>Asset Type</span>
                                  <strong>{watchlist.find(w => w.symbol === pos.symbol)?.type || 'N/A'}</strong>
                                </div>
                                <div className="exp-stat">
                                  <span>Price Change</span>
                                  <strong className={`mono-text ${isPos ? 'trend-up' : 'trend-down'}`}>
                                    {isPos ? '+' : ''}{(pos.currentPrice - pos.avgBuyPrice).toFixed(2)}
                                  </strong>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ======= Pending Limit Orders ======= */}
      {activeSubTab === 'open-orders' && (
        <div className="glassy-card orders-table-card">
          <div className="orders-table-header">
            <h3 className="card-title" style={{ fontSize: '16px' }}>Pending Limit Orders</h3>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              ← Swipe row left to cancel (mobile)
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">
              <Clock size={40} strokeWidth={1} />
              <p>No pending orders</p>
              <span>Limit orders waiting for execution will appear here</span>
            </div>
          ) : (
            <div className="swipe-orders-list">
              {/* Desktop header */}
              <div className="open-order-row open-order-header desktop-only">
                <div>Asset</div>
                <div>Type</div>
                <div style={{ textAlign: 'right' }}>Qty</div>
                <div style={{ textAlign: 'right' }}>Trigger Price</div>
                <div style={{ textAlign: 'right' }}>Action</div>
              </div>
              {orders.map(order => (
                <SwipeableOrderRow
                  key={order.id}
                  order={order}
                  onCancel={cancelOrder}
                  formatCurrency={fmt}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======= Order History ======= */}
      {activeSubTab === 'history' && (
        <div className="glassy-card orders-table-card">
          <div className="orders-table-header">
            <h3 className="card-title" style={{ fontSize: '16px' }}>Order History</h3>
            <span className="status-legend">
              <span className="chip-executed">Executed</span>
              <span className="chip-pending">Pending</span>
              <span className="chip-cancelled">Cancelled</span>
            </span>
          </div>

          {orderHistory.length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={40} strokeWidth={1} />
              <p>No order history</p>
              <span>Completed and cancelled orders will appear here</span>
            </div>
          ) : (
            <div className="positions-table-wrapper">
              <table className="positions-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Asset</th>
                    <th>Direction</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Total</th>
                    <th className="text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...orderHistory].reverse().map((order, idx) => (
                    <tr key={`${order.id}-${idx}`} className="positions-row">
                      <td style={{ fontSize: '11px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                        {order.timestamp}
                      </td>
                      <td className="mono-text" style={{ fontWeight: 700 }}>{order.symbol}</td>
                      <td>
                        <span className={`status-chip ${order.type === 'BUY' ? 'chip-buy' : 'chip-sell'}`}>
                          {order.type}
                        </span>
                      </td>
                      <td className="mono-text text-right">{order.shares}</td>
                      <td className="mono-text text-right">{fmt(order.price)}</td>
                      <td className="mono-text text-right">{fmt(order.shares * order.price)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`status-chip ${getStatusChipClass(order.status)}`}>
                          {order.status === 'FILLED' && <CheckCircle size={11} />}
                          {order.status === 'CANCELLED' && <XCircle size={11} />}
                          {order.status !== 'FILLED' && order.status !== 'CANCELLED' && <AlertCircle size={11} />}
                          {order.status === 'FILLED' ? 'Executed' : order.status === 'CANCELLED' ? 'Cancelled' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
