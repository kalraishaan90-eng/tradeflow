import React, { useState } from 'react';
import { TrendingUp, Loader2, Play } from 'lucide-react';

export default function AuthScreen({ onGoogleSignIn, onGitHubSignIn, onContinueAsGuest, error }) {
  const [signingIn, setSigningIn] = useState(null); // 'google' | 'github' | null

  const handleGoogle = async () => {
    setSigningIn('google');
    await onGoogleSignIn();
    setSigningIn(null);
  };

  const handleGitHub = async () => {
    setSigningIn('github');
    await onGitHubSignIn();
    setSigningIn(null);
  };

  return (
    <div className="auth-screen">
      {/* Animated background particles */}
      <div className="auth-bg-particles">
        <div className="auth-particle auth-particle--1" />
        <div className="auth-particle auth-particle--2" />
        <div className="auth-particle auth-particle--3" />
        <div className="auth-particle auth-particle--4" />
        <div className="auth-particle auth-particle--5" />
      </div>

      <div className="auth-card">
        {/* Logo / Brand */}
        <div className="auth-brand">
          <div className="auth-logo-icon">
            <TrendingUp size={28} />
          </div>
          <h1 className="auth-logo-text">
            Trade<span>Flow</span>
          </h1>
          <p className="auth-tagline">
            Advanced trading simulator with real-time market intelligence
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="auth-error">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4.5V8.5M8 10.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="auth-providers">
          <button
            className="auth-btn auth-btn--google"
            onClick={handleGoogle}
            disabled={signingIn !== null}
          >
            {signingIn === 'google' ? (
              <Loader2 size={20} className="auth-spinner" />
            ) : (
              <svg className="auth-btn-icon" viewBox="0 0 24 24" width="20" height="20">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <button
            className="auth-btn auth-btn--github"
            onClick={handleGitHub}
            disabled={signingIn !== null}
          >
            {signingIn === 'github' ? (
              <Loader2 size={20} className="auth-spinner" />
            ) : (
              <svg className="auth-btn-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            )}
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="auth-divider" aria-hidden="true"><span>or try it first</span></div>
        <button className="auth-btn auth-btn--guest" onClick={onContinueAsGuest}>
          <Play size={18} />
          <span>Continue as Guest</span>
        </button>
        <p className="auth-guest-note">No account required. Trial progress resets when you exit or refresh.</p>

        {/* Footer */}
        <div className="auth-footer">
          <div style={{ padding: '12px', background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.2)', borderRadius: '8px', marginBottom: '16px' }}>
            <p style={{ color: '#ff4d4d', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
              <strong>Disclaimer:</strong> TradeFlow is a paper-trading simulator and educational intelligence platform. No real money is involved, and trades are strictly simulated.
            </p>
          </div>
          <p>
            By continuing, you agree to TradeFlow's
            <a href="/terms.html" target="_blank" rel="noopener noreferrer"> Terms of Service</a> and
            <a href="/privacy.html" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Bottom credit */}
      <div className="auth-bottom-credit">
        <span>Powered by Firebase Authentication</span>
      </div>
    </div>
  );
}
