import { useEffect, useRef, useState } from 'react';

export default function AnimatedCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const rafRef = useRef(null);

  const [enabled, setEnabled] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const supportsFinePointer = window.matchMedia('(pointer:fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldEnable = supportsFinePointer && !prefersReducedMotion;

    setEnabled(shouldEnable);

    if (!shouldEnable) return undefined;

    document.body.classList.add('cursor-enabled');

    const hoverSelector = [
      'a',
      'button',
      'input',
      'textarea',
      'select',
      '[role="button"]',
      '.card-hover',
      '.cursor-hover'
    ].join(',');

    const onMove = (event) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };

    const onMouseOver = (event) => {
      const interactive = event.target.closest(hoverSelector);
      setIsHover(Boolean(interactive));
    };

    const onMouseOut = (event) => {
      const related = event.relatedTarget;
      if (!related || !related.closest || !related.closest(hoverSelector)) {
        setIsHover(false);
      }
    };

    const onDown = () => setIsPressed(true);
    const onUp = () => setIsPressed(false);

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.2;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('cursor-enabled');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isHover ? 'is-hover' : ''} ${isPressed ? 'is-pressed' : ''}`}
      />
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isHover ? 'is-hover' : ''} ${isPressed ? 'is-pressed' : ''}`}
      />
    </>
  );
}
