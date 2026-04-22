import { Link } from 'react-router-dom';
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
      <header className={s.header}>
        <Link to="/" className={s.logo}>
          <span className={s.logoEl}>El</span>
          <span> Conciergio</span>
        </Link>
      </header>

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
