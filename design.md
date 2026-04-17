# Design System — El Conciergio

## Colors
```css
:root {
  --green:       #25D366;  /* WhatsApp green — primary brand */
  --green-dark:  #128C7E;  /* Gradient end, hover states */
  --green-deep:  #075E54;  /* Header gradient start */
  --green-light: #E8F5EE;  /* Light green backgrounds */
  --black:       #1A1A1A;  /* Primary dark — headings, nav bg */
  --white:       #FFFFFF;
  --off-white:   #FAFAF8;  /* Page background */
  --gray-text:   #555555;  /* Body text */
  --gray-muted:  #888888;  /* Secondary text, captions */
  --gray-light:  #F0F2F5;  /* Input backgrounds, light sections */
  --gold:        #C9A84C;  /* Premium accent — use sparingly */
  --border:      #E9EDEF;  /* Default border color */
}
```

## Typography
```css
/* Display / Headings */
font-family: Georgia, 'Times New Roman', serif;

/* Body / UI */
font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
/* Load via: <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap"> */

/* Scale */
--text-xs:   11px;   /* badges, captions, legal */
--text-sm:   13px;   /* secondary labels */
--text-base: 16px;   /* body text */
--text-lg:   20px;   /* lead paragraphs */
--text-xl:   28px;   /* section subtitles */
--text-2xl:  36px;   /* section titles */
--text-3xl:  48px;   /* hero headline */
--text-4xl:  64px;   /* big stat numbers */
```

## Spacing
```css
--space-xs:  8px;
--space-sm:  16px;
--space-md:  24px;
--space-lg:  48px;
--space-xl:  80px;
--space-2xl: 120px;
```

## Border radius
```css
--radius-sm:  8px;
--radius-md:  12px;
--radius-lg:  20px;
--radius-xl:  32px;
--radius-pill: 999px;
```

## Shadows
```css
--shadow-sm:  0 1px 3px rgba(0,0,0,0.08);
--shadow-md:  0 4px 16px rgba(0,0,0,0.10);
--shadow-lg:  0 12px 40px rgba(0,0,0,0.14);
--shadow-green: 0 4px 20px rgba(37,211,102,0.35);
```

## Buttons
```css
/* Primary — green */
.btn-primary {
  background: var(--green);
  color: white;
  padding: 14px 28px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 15px;
  box-shadow: var(--shadow-green);
  transition: transform 0.15s, box-shadow 0.15s;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(37,211,102,0.45);
}

/* Secondary — outline */
.btn-secondary {
  background: transparent;
  color: var(--black);
  padding: 13px 27px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-pill);
  font-weight: 500;
  font-size: 15px;
}
.btn-secondary:hover {
  border-color: var(--green);
  color: var(--green);
}
```

## Section patterns
```css
/* Standard section */
.section {
  padding: var(--space-xl) 20px;
  max-width: 1100px;
  margin: 0 auto;
}

/* Dark section (ROI) */
.section-dark {
  background: var(--black);
  color: white;
  padding: var(--space-xl) 20px;
}

/* Green section (Final CTA) */
.section-green {
  background: var(--green);
  color: white;
  padding: var(--space-xl) 20px;
  text-align: center;
}

/* Light green tint */
.section-tint {
  background: var(--green-light);
}
```

## Cards
```css
.card {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
}
.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  transition: all 0.2s;
}
```

## Section label (small green uppercase above title)
```css
.section-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--green);
  margin-bottom: 12px;
}
```

## Mobile sticky WhatsApp button
```css
.wa-sticky {
  display: none; /* show on mobile only */
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background: var(--green);
  color: white;
  border-radius: var(--radius-pill);
  padding: 12px 20px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: var(--shadow-lg);
}
@media (max-width: 768px) {
  .wa-sticky { display: flex; align-items: center; gap: 8px; }
}
```

## Animations
```css
/* Fade in on scroll */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* JS to trigger: */
/* const observer = new IntersectionObserver(els => 
     els.forEach(el => el.isIntersecting && el.target.classList.add('visible')));
   document.querySelectorAll('.fade-in').forEach(el => observer.observe(el)); */
```

## Responsive breakpoints
```css
/* Mobile first */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```
