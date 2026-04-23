import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import MentionsLegales from '@/pages/MentionsLegales';
import PolitiqueConfidentialite from '@/pages/PolitiqueConfidentialite';
import CGV from '@/pages/CGV';

function getRouterBasename() {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    if (pathname === '/elconciergio' || pathname.startsWith('/elconciergio/')) {
      return '/elconciergio';
    }
  }

  const baseUrl = import.meta.env.BASE_URL ?? '/';
  const normalized = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return normalized && normalized !== '/' ? normalized : undefined;
}

export default function App() {
  const basename = getRouterBasename();

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/cgv" element={<CGV />} />
      </Routes>
    </BrowserRouter>
  );
}
