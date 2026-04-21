import { useEffect, useRef } from 'react';
import s from './ScrollRevealGrid.module.css';

/* ═══════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════ */

const SCROLL_VH = 7;
const GAP       = 12; // px gap between cards

const clamp    = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut3 = (p: number) => 1 - Math.pow(1 - clamp(p, 0, 1), 3);
const prog     = (v: number, a: number, b: number) => clamp((v - a) / (b - a), 0, 1);
const reveal   = (el: HTMLElement | null, p: number) => {
  if (!el) return;
  const q = clamp(p, 0, 1);
  el.style.opacity   = String(Math.pow(q, 0.6));
  el.style.transform = `translateY(${(1 - q) * 18}px)`;
  el.style.filter    = `blur(${(1 - q) * 6}px)`;
};

/*
  Layout:
    leftCol (70%)  → Block B alone
    rightCol (30%) → Block A (top) + Block C (bottom, slides up)

  Timeline:
    [0.00 – 0.42]  videoA plays, Block A full width (rightCol = 100%)
    [0.42 – 0.62]  Block B slides in from left (leftCol 0%→70%, rightCol 100%→30%)
    [0.62 – 0.84]  videoB plays
    [0.84 – 0.96]  Block C slides up below Block A
*/
const T = {
  VIDEO_A:  [0.00, 0.42] as [number, number],
  TEXT_A:   [0.03, 0.18] as [number, number],
  BLOCK_B:  [0.42, 0.62] as [number, number],
  TEXT_B:   [0.54, 0.68] as [number, number],
  VIDEO_B:  [0.62, 0.84] as [number, number],
  BLOCK_C:  [0.84, 0.96] as [number, number],
  TEXT_C:   [0.88, 0.98] as [number, number],
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function ScrollRevealGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef      = useRef<HTMLDivElement>(null);
  const leftColRef   = useRef<HTMLDivElement>(null);  // Block B — grows to 70% on left
  const rightColRef  = useRef<HTMLDivElement>(null);  // Block A + C — shrinks to 30% on right
  const blockARef    = useRef<HTMLDivElement>(null);
  const blockBRef    = useRef<HTMLDivElement>(null);
  const blockCRef    = useRef<HTMLDivElement>(null);
  const videoARef    = useRef<HTMLVideoElement>(null);
  const videoBRef    = useRef<HTMLVideoElement>(null);
  const videoCRef    = useRef<HTMLVideoElement>(null);
  const textARef     = useRef<HTMLDivElement>(null);  // h2 only — anchored bottom-left
  const textATopRef  = useRef<HTMLDivElement>(null);  // label + sub — top-left, fades out
  const h2ARef       = useRef<HTMLHeadingElement>(null);
  const textBRef     = useRef<HTMLDivElement>(null);
  const textCRef     = useRef<HTMLDivElement>(null);
  const veilCRef     = useRef<HTMLDivElement>(null);

  /* ── Container height ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const apply = () => { container.style.height = `${window.innerHeight * (1 + SCROLL_VH)}px`; };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  /* ── RAF loop ── */
  useEffect(() => {
    const container = containerRef.current;
    const grid      = gridRef.current;
    const leftCol   = leftColRef.current;
    const rightCol  = rightColRef.current;
    const blockA    = blockARef.current;
    const blockB    = blockBRef.current;
    const blockC    = blockCRef.current;
    const videoA    = videoARef.current;
    const videoB    = videoBRef.current;
    const videoC    = videoCRef.current;
    const textA     = textARef.current;
    const textATop  = textATopRef.current;
    const h2A       = h2ARef.current;
    const textB     = textBRef.current;
    const textC     = textCRef.current;
    const veilC     = veilCRef.current;
    if (!container || !grid) return;

    let rafId: number;

    const tick = () => {
      const rect       = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;

      if (scrollable > 0) {
        const cp = clamp(-rect.top / scrollable, 0, 1);

        /* ── Block B — left col grows 0%→70%, right col shrinks 100%→30% ── */
        const bBP    = easeOut3(prog(cp, ...T.BLOCK_B));
        const leftW  = bBP * 70;
        const colGap = bBP * GAP;

        grid.style.columnGap = `${colGap}px`;
        if (leftCol) {
          leftCol.style.flexBasis = `${leftW}%`;
          leftCol.style.opacity   = String(clamp(bBP * 4, 0, 1));
        }
        if (rightCol) rightCol.style.flexBasis = `calc(${100 - leftW}% - ${colGap}px)`;

        /* ── Block A text — top group fades out, h2 stays + font-size lerps ── */
        const shrinkOp = clamp(1 - bBP * 2.5, 0, 1);
        if (h2A) {
          const minPx  = (22 - bBP * 9).toFixed(1);
          const prefVw = (2.6 - bBP * 1.2).toFixed(2);
          const maxPx  = (42 - bBP * 20).toFixed(1);
          h2A.style.fontSize = `clamp(${minPx}px, ${prefVw}vw, ${maxPx}px)`;
        }

        /* ── Block C — slides up below Block A (inside rightCol) ── */
        const bCP    = easeOut3(prog(cp, ...T.BLOCK_C));
        const cH     = bCP * 50;   // 0 → 50% of rightCol height
        const rowGap = bCP * GAP;

        if (rightCol) rightCol.style.rowGap   = `${rowGap}px`;
        if (blockA)   blockA.style.flexBasis  = `calc(${100 - cH}% - ${rowGap}px)`;
        if (blockC)   {
          blockC.style.flexBasis = `${cH}%`;
          blockC.style.opacity   = String(clamp(bCP * 4, 0, 1));
        }

        /* ── Video scrub — each plays in its own range ── */
        if (videoA && videoA.readyState >= 2 && videoA.duration) {
          videoA.currentTime = prog(cp, ...T.VIDEO_A) * videoA.duration;
        }
        if (videoB && videoB.readyState >= 2 && videoB.duration) {
          videoB.currentTime = prog(cp, T.BLOCK_B[0], T.VIDEO_B[1]) * videoB.duration;
        }
        if (videoC && videoC.readyState >= 2 && videoC.duration) {
          videoC.currentTime = prog(cp, T.BLOCK_C[0], 1.0) * videoC.duration;
        }

        /* ── Text reveals ── */
        const rA = easeOut3(prog(cp, ...T.TEXT_A));
        // h2 — reveals then stays
        if (textA) {
          textA.style.opacity   = String(Math.pow(clamp(rA, 0, 1), 0.6));
          textA.style.transform = `translateY(${(1 - rA) * 16}px)`;
          textA.style.filter    = `blur(${(1 - rA) * 6}px)`;
        }
        // label + sub — reveals then fades out with Block B
        if (textATop) {
          textATop.style.opacity   = String(Math.pow(clamp(rA, 0, 1), 0.6) * shrinkOp);
          textATop.style.transform = `translateY(${(1 - rA) * 16}px)`;
          textATop.style.filter    = `blur(${(1 - rA) * 6}px)`;
        }
        reveal(textB, easeOut3(prog(cp, ...T.TEXT_B)));
        const rC = easeOut3(prog(cp, ...T.TEXT_C));
        reveal(textC, rC);
        if (veilC) veilC.style.opacity = String(clamp(rC * 1.5, 0, 1));
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={containerRef} className={s.container}>
      <div className={s.sticky}>
        <div ref={gridRef} className={s.grid}>

          {/* ── Left col: Block B alone (0% → 70%) ── */}
          <div ref={leftColRef} className={s.leftCol} style={{ flexBasis: '0%', opacity: 0 }}>
            <div ref={blockBRef} className={`${s.block} ${s.blockB}`}>
              <video
                ref={videoBRef}
                src="/vid/scene03b.mp4"
                muted playsInline preload="auto"
                className={s.video}
              />
              <div className={s.blockBGrad} />
              <div ref={textBRef} className={s.textB} style={{ opacity: 0 }}>
                <h3 className={s.titleSm}>
                  Périodes creuses ?<br />Relancez vos anciens clients.
                </h3>
                <p className={s.subSm}>
                  Nouvelles dispo, offres ciblées — envoyées au bon moment, sur WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* ── Right col: Block A (top) + Block C (bottom, slides up) ── */}
          <div ref={rightColRef} className={s.rightCol}>

            {/* Block A */}
            <div ref={blockARef} className={`${s.block} ${s.blockA}`} style={{ flexBasis: '100%' }}>
              <video
                ref={videoARef}
                src="/vid/scene03a.mp4"
                muted playsInline preload="auto"
                className={s.video}
              />
              <div className={s.blockAGrad} />
              {/* Label + sub — top-left, fades out as Block B enters */}
              <div ref={textATopRef} className={s.textATop} style={{ opacity: 0 }}>
                <span className={s.label}>Fidélisation client</span>
                <p className={s.sub}>
                  El Conciergio maintient le lien avec vos voyageurs —
                  anniversaires, nouvelles saisons, occasions spéciales.
                  Automatiquement, sur WhatsApp.
                </p>
              </div>
              {/* H2 — bottom-left, stays and wraps when narrow */}
              <div ref={textARef} className={s.textA} style={{ opacity: 0 }}>
                <h2 ref={h2ARef} className={s.titleLg}>
                  Une relation qui continue,<br />même après le séjour
                </h2>
              </div>
            </div>

            {/* Block C — video + stat, slides up below Block A */}
            <div ref={blockCRef} className={`${s.block} ${s.blockC}`} style={{ flexBasis: '0%', opacity: 0 }}>
              <video
                ref={videoCRef}
                src="/vid/scene03c.mp4"
                muted playsInline preload="auto"
                className={s.video}
              />
              <div ref={veilCRef} className={s.blockCGrad} style={{ opacity: 0 }} />
              <div ref={textCRef} className={s.textC} style={{ opacity: 0 }}>
                <span className={s.statValue}>+31%</span>
                <p className={s.statDesc}>
                  de taux de retour moyen<br />chez les hôtes El Conciergio
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
