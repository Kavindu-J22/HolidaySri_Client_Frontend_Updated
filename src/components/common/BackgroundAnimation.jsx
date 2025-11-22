import React from 'react';

const BackgroundAnimation = () => {
  // Generate natural-looking leaves - FEWER, SMALLER, MORE SPREAD OUT
  const leaves = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 30}s`, // More spread out timing
    animationDuration: `${30 + Math.random() * 20}s`, // Slower: 30-50s
    size: 16 + Math.random() * 8, // Smaller: 16-24px
    emoji: i % 2 === 0 ? '🍂' : '🍃', // Brown leaf 🍂 and green leaf 🍃
    rotation: Math.random() * 360,
    drift: -10 + Math.random() * 20 // Subtle horizontal drift
  }));

  // More stars with better visibility
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${2 + Math.random() * 3}s`,
    size: 4 + Math.random() * 5
  }));

  // Add comets (shooting stars) - occasional and SLOWER
  const comets = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    animationDelay: `${i * 15 + Math.random() * 10}s`, // Less frequent: every 15-25s
    startTop: `${Math.random() * 40}%`,
    startLeft: `${70 + Math.random() * 30}%`,
    duration: `${3 + Math.random() * 2}s` // Slower: 3-5s duration
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Leaves - Using Emoji 🍂 and 🍃 - Natural & Sparse */}
      {leaves.map((leaf) => (
        <div
          key={`leaf-${leaf.id}`}
          className="absolute animate-float-down opacity-40 dark:opacity-25"
          style={{
            left: leaf.left,
            top: '-80px',
            animationDelay: leaf.animationDelay,
            animationDuration: leaf.animationDuration,
            '--drift-x': `${leaf.drift}px`,
            fontSize: `${leaf.size}px`,
            transform: `rotate(${leaf.rotation}deg)`,
            lineHeight: 1
          }}
        >
          {leaf.emoji}
        </div>
      ))}

      {/* Twinkling Stars - More Visible */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.animationDelay,
            animationDuration: star.animationDuration,
          }}
        >
          <svg
            width={star.size}
            height={star.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-yellow-300 dark:text-yellow-200 drop-shadow-[0_0_3px_rgba(250,204,21,0.8)]"
          >
            <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.7-6.3 4.7 2.3-7-6-4.6h7.6z"/>
          </svg>
        </div>
      ))}

      {/* Comets (Shooting Stars) */}
      {comets.map((comet) => (
        <div
          key={`comet-${comet.id}`}
          className="absolute animate-comet opacity-0"
          style={{
            left: comet.startLeft,
            top: comet.startTop,
            animationDelay: comet.animationDelay,
            animationDuration: comet.duration,
          }}
        >
          {/* Comet head */}
          <div className="relative">
            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
            {/* Comet tail */}
            <div className="absolute top-0 left-0 w-16 h-0.5 bg-gradient-to-r from-white via-blue-200 to-transparent opacity-80 transform -rotate-45 origin-left"></div>
          </div>
        </div>
      ))}

      {/* Subtle gradient orbs for depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/10 dark:bg-primary-500/5 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200/10 dark:bg-purple-500/5 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob-slow animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200/10 dark:bg-pink-500/5 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob-slow animation-delay-4000"></div>
    </div>
  );
};

export default BackgroundAnimation;

