import { useEffect } from 'react';
import Lenis from 'lenis';
import ScrollVideoHero from './sections/ScrollVideoHero';
import ScrollRevealText from './sections/ScrollRevealText';
import ScrollVideoScene02 from './sections/ScrollVideoScene02';
import ScrollRevealGrid from './sections/ScrollRevealGrid';
import BenefitsAccordionSection from './sections/BenefitsAccordionSection';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
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

    // Expose lenis on window so scroll listeners can use lenis.on('scroll') if needed
    (window as unknown as Record<string, unknown>).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as Record<string, unknown>).__lenis;
    };
  }, []);

  return (
    <div style={{ background: 'var(--site-bg)', overflowX: 'clip', width: '100%' }}>
      <ScrollVideoHero />
      <ScrollRevealText />
      <ScrollVideoScene02 />
      <ScrollRevealGrid />
      <BenefitsAccordionSection />
    </div>
  );
}

export default App;
