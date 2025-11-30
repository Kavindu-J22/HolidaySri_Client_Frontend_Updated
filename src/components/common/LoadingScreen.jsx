import React from 'react';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        background: '#0a0a0a',
        textAlign: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      {/* Beautiful Dark Background with Subtle Gradient Orbs */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 20% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(17, 24, 39, 1) 0%, #0a0a0a 100%)',
        zIndex: 0
      }}></div>

      {/* Subtle Animated Gradient Line at Top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5), transparent)',
        animation: 'shimmerLine 3s ease-in-out infinite',
        zIndex: 1
      }}></div>

      {/* Main Content Container - Clean & Minimal */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px',
      }}>
        {/* GIF Container - Professional Presentation */}
        <div style={{
          position: 'relative',
          width: '240px',
          height: '240px',
          marginBottom: '32px',
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#000000',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: 'subtleFloat 6s ease-in-out infinite',
        }}>
          <img
            src="https://res.cloudinary.com/dqdcmluxj/image/upload/v1738033679/clideo_editor_d5e6636056944e7f9dbf6bc6d9acae0d-ezgif.com-crop_1_p7heeg.gif"
            alt="Holidaysri Loading"
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Brand Name - Clean Typography */}
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: '28px',
          fontWeight: '600',
          color: '#ffffff',
          fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
          letterSpacing: '-0.5px',
        }}>
          Holidaysri.com
        </h1>

        {/* Tagline - Subtle */}
        <p style={{
          margin: '0 0 32px 0',
          fontSize: '14px',
          color: 'rgba(148, 163, 184, 0.8)',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: '400',
          letterSpacing: '0.2px',
        }}>
          Your Gateway to Sri Lanka
        </p>

        {/* Modern Loading Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          {/* Animated Dots */}
          <div style={{
            display: 'flex',
            gap: '6px',
          }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  animation: `dotPulse 1.4s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Loading Text - Minimal */}
        <p style={{
          margin: '20px 0 0 0',
          fontSize: '11px',
          color: 'rgba(100, 116, 139, 0.7)',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          fontWeight: '500',
        }}>
          Loading
        </p>
      </div>

      {/* Keyframes for Animations */}
      <style>
        {`
          @keyframes subtleFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }

          @keyframes dotPulse {
            0%, 80%, 100% {
              transform: scale(0.6);
              opacity: 0.4;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes shimmerLine {
            0% { opacity: 0.3; transform: translateX(-100%); }
            50% { opacity: 0.6; }
            100% { opacity: 0.3; transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;