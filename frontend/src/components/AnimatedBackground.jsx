import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AnimatedBackground({ opacity = 0.12 }) {
  const containerRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    // Soft, slow movement for gradient orbs
    tl.to(orb1Ref.current, {
      x: 50,
      y: -30,
      duration: 12,
      ease: 'sine.inOut'
    }, 0);

    tl.to(orb2Ref.current, {
      x: -40,
      y: 40,
      duration: 15,
      ease: 'sine.inOut'
    }, 0);

    tl.to(orb3Ref.current, {
      x: 30,
      y: 50,
      duration: 14,
      ease: 'sine.inOut'
    }, 0);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity }}
    >
      {/* Gradient Orb 1 - Blue */}
      <div
        ref={orb1Ref}
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
          willChange: 'transform'
        }}
      />

      {/* Gradient Orb 2 - Purple */}
      <div
        ref={orb2Ref}
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
          filter: 'blur(100px)',
          willChange: 'transform'
        }}
      />

      {/* Gradient Orb 3 - Indigo */}
      <div
        ref={orb3Ref}
        className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          filter: 'blur(90px)',
          willChange: 'transform'
        }}
      />
    </div>
  );
}
