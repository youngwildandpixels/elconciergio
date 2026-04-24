import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import PageSeo from '@/components/PageSeo';
import ScrollVideoHero from '@/sections/ScrollVideoHero';
import ServicesTicker from '@/sections/ServicesTicker';
import ScrollRevealText from '@/sections/ScrollRevealText';
import ScrollVideoScene02 from '@/sections/ScrollVideoScene02';
import ScrollRevealGrid from '@/sections/ScrollRevealGrid';
import WhyWhatsApp from '@/sections/WhyWhatsApp';
import BenefitsAccordionSection from '@/sections/BenefitsAccordionSection';
import PricingContact from '@/sections/PricingContact';
import Navbar from '@/sections/Navbar';
import Footer from '@/sections/Footer';

export default function HomePage() {
  const footerWrapRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(520);

  useEffect(() => {
    const el = footerWrapRef.current;
    if (!el) return;

    const resize = () => setFooterHeight(el.offsetHeight);
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    (window as unknown as Record<string, unknown>).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as Record<string, unknown>).__lenis;
    };
  }, []);

  return (
    <div style={{ background: 'var(--site-bg)', overflowX: 'clip', width: '100%' }}>
      <PageSeo
        title="El Conciergio — Conciergerie WhatsApp IA pour Airbnb & Gîtes"
        description="Votre bot WhatsApp pour Airbnb, gîtes et B&B. Répond à vos voyageurs 24h/24, multilingue, opérationnel en moins de 7 jours. Découvrez El Conciergio →"
      />
      <Navbar />
      <div style={{ position: 'relative', zIndex: 2, background: 'var(--site-bg)', marginBottom: footerHeight }}>
        <ScrollVideoHero />
        <ScrollRevealText />
        <ServicesTicker />
        <ScrollVideoScene02 />
        <WhyWhatsApp />
        <ScrollRevealGrid />
        <BenefitsAccordionSection />
        <PricingContact />
      </div>
      <div
        ref={footerWrapRef}
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 0 }}
      >
        <Footer />
      </div>
    </div>
  );
}
