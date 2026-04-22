import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import MentionsLegales from '@/pages/MentionsLegales';
import PolitiqueConfidentialite from '@/pages/PolitiqueConfidentialite';
import CGV from '@/pages/CGV';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/cgv" element={<CGV />} />
      </Routes>
    </HashRouter>
  );
}
