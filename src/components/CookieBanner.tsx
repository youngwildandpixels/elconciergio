import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  clearCookieConsent,
  getCookieConsent,
  loadGoogleAnalytics,
  setCookieConsent,
  trackEvent,
  trackPageView,
} from '@/lib/analytics';
import { OPEN_COOKIE_SETTINGS_EVENT } from '@/lib/cookieSettings';
import s from './CookieBanner.module.css';

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => getCookieConsent() === null);

  useEffect(() => {
    const openSettings = () => {
      clearCookieConsent();
      setVisible(true);
    };

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  const reject = () => {
    setCookieConsent('rejected');
    setVisible(false);
  };

  const accept = () => {
    setCookieConsent('accepted');
    loadGoogleAnalytics();
    trackPageView(`${window.location.pathname}${window.location.search}${window.location.hash}`);
    trackEvent({ action: 'cookie_consent_accept', category: 'privacy' });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside className={s.banner} aria-label="Préférences cookies">
      <div>
        <p className={s.title}>Cookies</p>
        <p className={s.text}>
          Nous utilisons Google Analytics uniquement avec votre accord pour mesurer les visites,
          les clics et améliorer la landing page. Vous pouvez accepter ou refuser librement.
          {' '}
          <Link to="/politique-confidentialite" className={s.link}>
            En savoir plus
          </Link>
          .
        </p>
      </div>

      <div className={s.actions}>
        <button type="button" className={s.button} onClick={reject}>
          Refuser
        </button>
        <button type="button" className={`${s.button} ${s.primary}`} onClick={accept}>
          Accepter
        </button>
      </div>
    </aside>
  );
}
