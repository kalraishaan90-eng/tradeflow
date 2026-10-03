import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_SIMULATED_CASH,
  clampDepositAmount,
  getPendingBuyCommitments,
  getAvailableSharesForSell,
  isLeaderboardEligible,
  isValidTradeInput,
  normalizePortfolio,
} from '../src/lib/tradingGuards.mjs';

test('rejects invalid trade quantities and prices', () => {
  assert.equal(isValidTradeInput(0, 10), false);
  assert.equal(isValidTradeInput(1.5, 10), false);
  assert.equal(isValidTradeInput(1, 0), false);
  assert.equal(isValidTradeInput(1, Number.POSITIVE_INFINITY), false);
  assert.equal(isValidTradeInput(2, 12.5), true);
});

test('calculates committed cash from open buy limit orders', () => {
  const portfolio = {
    orders: [
      { type: 'BUY', shares: 10, price: 50 },
      { type: 'SELL', shares: 99, price: 1 },
      { type: 'BUY', shares: 2, price: 25 },
    ],
  };

  assert.equal(getPendingBuyCommitments(portfolio), 550);
});

test('subtracts pending sell orders from available holdings', () => {
  const portfolio = {
    positions: [{ symbol: 'AAPL', shares: 10 }],
    orders: [
      { symbol: 'AAPL', type: 'SELL', shares: 4, price: 200 },
      { symbol: 'TSLA', type: 'SELL', shares: 9, price: 200 },
    ],
  };

  assert.equal(getAvailableSharesForSell(portfolio, 'AAPL'), 6);
});

test('caps top-ups and marks topped-up accounts ineligible for public ranking', () => {
  assert.equal(clampDepositAmount(0), 0);
  assert.equal(clampDepositAmount(1_000), 1_000);
  assert.equal(clampDepositAmount(MAX_SIMULATED_CASH * 2), MAX_SIMULATED_CASH);

  assert.equal(isLeaderboardEligible({ leaderboardEligible: true, cashDeposited: 0 }), true);
  assert.equal(isLeaderboardEligible({ leaderboardEligible: true, cashDeposited: 1 }), false);
  assert.equal(isLeaderboardEligible({ leaderboardEligible: false, cashDeposited: 0 }), false);
});

test('normalizes hostile portfolio data from client-writable storage', () => {
  const normalized = normalizePortfolio({
    balance: '999999999',
    positions: [{ symbol: 'AAPL', shares: '2', avgBuyPrice: '190' }, { symbol: '<x>', shares: -1, avgBuyPrice: 1 }],
    orders: [{ symbol: 'AAPL', type: 'BUY', shares: 1, price: 10 }, { symbol: 'BAD', type: 'HACK', shares: 1, price: 1 }],
    orderHistory: new Array(250).fill({ symbol: 'AAPL', type: 'BUY', shares: 1, price: 10, status: 'FILLED' }),
    history: [{ value: 100000 }, { value: Number.NaN }],
    leaderboardEligible: 'yes',
    cashDeposited: '500',
  });

  assert.equal(normalized.balance, MAX_SIMULATED_CASH);
  assert.deepEqual(normalized.positions, [{ symbol: 'AAPL', shares: 2, avgBuyPrice: 190 }]);
  assert.equal(normalized.orders.length, 1);
  assert.equal(normalized.orderHistory.length, 100);
  assert.equal(normalized.history.length, 1);
  assert.equal(normalized.leaderboardEligible, false);
  assert.equal(normalized.cashDeposited, 500);
});
