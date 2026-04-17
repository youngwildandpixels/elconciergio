import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Stats from './sections/Stats';
import Features from './sections/Features';
import Solution from './sections/Solution';
import FeaturesGrid from './sections/FeaturesGrid';
import Testimonial from './sections/Testimonial';
import GettingStarted from './sections/GettingStarted';
import ROI from './sections/ROI';
import AiDemo from './sections/AiDemo';
import Pricing from './sections/Pricing';
import FAQ from './sections/FAQ';
import CTA from './sections/CTA';
import Footer from './sections/Footer';
import FloatingChat from './components/FloatingChat';

function App() {
  return (
    <div style={{ background: 'var(--off-white)' }}>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Solution />
      <FeaturesGrid />
      <Testimonial />
      <GettingStarted />
      <ROI />
      <AiDemo />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
      <FloatingChat />
    </div>
  );
}

export default App;
