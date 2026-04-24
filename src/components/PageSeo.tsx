import { useEffect } from 'react';
import SchemaMarkup from './SchemaMarkup';

type PageSeoProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  imagePath?: string;
  robots?: string;
  siteName?: string;
};

function upsertMetaByName(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function withBase(path: string) {
  const baseUrl = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');

  if (normalizedBase && path.startsWith(`${normalizedBase}/`)) {
    return path;
  }

  const fullPath = `${normalizedBase}/${normalizedPath}`.replace(/\/{2,}/g, '/');
  return fullPath.startsWith('/') ? fullPath : `/${fullPath}`;
}

function getSiteOrigin() {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined;
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // Ignore invalid env value and fallback to runtime origin.
    }
  }
  return window.location.origin;
}

export default function PageSeo({
  title,
  description,
  canonicalPath,
  imagePath = '/img/banner-mobile.webp',
  robots = 'index,follow',
  siteName = 'El Conciergio',
}: PageSeoProps) {
  useEffect(() => {
    const siteOrigin = getSiteOrigin();
    const currentPath = canonicalPath ?? window.location.pathname;
    const canonicalUrl = currentPath.startsWith('http')
      ? currentPath
      : `${siteOrigin}${currentPath}`;
    const imageUrl = imagePath.startsWith('http')
      ? imagePath
      : `${siteOrigin}${withBase(imagePath)}`;

    document.title = title;
    upsertCanonicalLink(canonicalUrl);
    upsertMetaByName('description', description);
    upsertMetaByName('robots', robots);
    upsertMetaByProperty('og:type', 'website');
    upsertMetaByProperty('og:locale', 'fr_FR');
    upsertMetaByProperty('og:site_name', siteName);
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:url', canonicalUrl);
    upsertMetaByProperty('og:image', imageUrl);
    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', title);
    upsertMetaByName('twitter:description', description);
    upsertMetaByName('twitter:image', imageUrl);
  }, [canonicalPath, description, imagePath, robots, siteName, title]);

  return <SchemaMarkup />;
}
