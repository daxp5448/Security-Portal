import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function FloatingCard({ 
  children, 
  className = '', 
  intensity = 'medium',
  delay = 0 
}) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Gentle floating animation
    const floatDistance = intensity === 'low' ? 5 : intensity === 'high' ? 15 : 10;
    const duration = intensity === 'low' ? 6 : intensity === 'high' ? 4 : 5;

    gsap.to(card, {
      y: -floatDistance,
      duration: duration,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: delay
    });

    return () => {
      gsap.killTweensOf(card);
    };
  }, [intensity, delay]);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.02,
      y: -6,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  return (
    <div
      ref={cardRef}
      className={`glass-card hover-lift ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  );
}
