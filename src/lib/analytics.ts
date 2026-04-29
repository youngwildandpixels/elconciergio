export type AnalyticsEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
};

const GA_SCRIPT_ID = 'ga4-script';
const CONSENT_KEY = 'elconciergio-cookie-consent';

export type CookieConsent = 'accepted' | 'rejected';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getGaMeasurementId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
}

export function getCookieConsent(): CookieConsent | null {
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === 'accepted' || value === 'rejected' ? value : null;
}

export function setCookieConsent(value: CookieConsent) {
  window.localStorage.setItem(CONSENT_KEY, value);
}

export function clearCookieConsent() {
  window.localStorage.removeItem(CONSENT_KEY);
}

export function hasAnalyticsConsent() {
  return getCookieConsent() === 'accepted';
}

export function loadGoogleAnalytics() {
  const measurementId = getGaMeasurementId();
  if (!measurementId || !hasAnalyticsConsent()) return false;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement('script');
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);

    window.gtag('js', new Date());
  }

  window.gtag('config', measurementId, {
    send_page_view: false,
    anonymize_ip: true,
  });

  return true;
}

export function trackPageView(path: string, title = document.title) {
  const measurementId = getGaMeasurementId();
  if (!measurementId || !hasAnalyticsConsent()) return;

  loadGoogleAnalytics();
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

export function trackEvent({ action, category, label, value }: AnalyticsEvent) {
  if (!getGaMeasurementId() || !hasAnalyticsConsent()) return;

  loadGoogleAnalytics();
  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}

export function trackContactClick(label: string) {
  trackEvent({
    action: 'contact_click',
    category: 'engagement',
    label,
  });
}
