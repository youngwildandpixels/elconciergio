import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent, trackPageView } from '@/lib/analytics';

export default function AnalyticsPageViews() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}${location.hash}`);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const sentDepths = new Set<number>();
    const depths = [50, 90];

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.round((window.scrollY / scrollable) * 100);
      depths.forEach((depth) => {
        if (progress >= depth && !sentDepths.has(depth)) {
          sentDepths.add(depth);
          trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: `${depth}%`,
            value: depth,
          });
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  return null;
}
