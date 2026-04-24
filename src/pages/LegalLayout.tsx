import { Link } from 'react-router-dom';
import Navbar from '@/sections/Navbar';
import s from './LegalPages.module.css';

export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={s.page}>
      <Navbar forceBeige />

      <main className={s.main}>
        <div className={s.container}>
          <h1 className={s.title}>{title}</h1>
          <div className={s.content}>{children}</div>
        </div>
      </main>

      <footer className={s.footer}>
        <Link to="/" className={s.backLink}>← Retour au site</Link>
        <p className={s.copyright}>© 2025 El Conciergio</p>
      </footer>
    </div>
  );
}
