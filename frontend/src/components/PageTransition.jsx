import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageTransition({ children, className = '' }) {
  const pageRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    // Smooth entrance animation
    gsap.fromTo(
      page,
      { 
        opacity: 0, 
        y: 15 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        ease: 'power3.out' 
      }
    );

    return () => {
      gsap.killTweensOf(page);
    };
  }, []);

  return (
    <div 
      ref={pageRef}
      className={className}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </div>
  );
}
