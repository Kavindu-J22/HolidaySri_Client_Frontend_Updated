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
        background: 'linear-gradient(135deg, #0a1218 0%, #1a2a32 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 70% 30%, rgba(25, 100, 150, 0.15) 0%, transparent 70%)',
        zIndex: 1
      }}></div>
      
      {/* Floating Particles */}
      {[...Array(25)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          background: `rgba(83, 180, 245, ${Math.random() * 0.3 + 0.1})`,
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          borderRadius: '50%',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 15 + 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`,
          filter: 'blur(1px)',
          zIndex: 1
        }}></div>
      ))}

      {/* Main Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 60px',
        borderRadius: '20px',
        background: 'rgba(10, 25, 35, 0.7)',
        boxShadow: '0 0 40px rgba(50, 150, 200, 0.4)',
        border: '1px solid rgba(100, 180, 220, 0.3)',
        maxWidth: '90%',
        backdropFilter: 'blur(5px)'
      }}>
        {/* Animated GIF with Glow Effect */}
        <div style={{
          position: 'relative',
          width: '220px',
          height: '220px',
          marginBottom: '20px',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(83, 180, 245, 0.4)',
          border: '2px solid rgba(83, 180, 245, 0.3)',
          animation: 'pulse 3s ease-in-out infinite',
          backgroundColor: 'black', // Added black background
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img
            src="https://res.cloudinary.com/dqdcmluxj/image/upload/v1738033679/clideo_editor_d5e6636056944e7f9dbf6bc6d9acae0d-ezgif.com-crop_1_p7heeg.gif"
            alt="Loading"
            style={{
              width: '100%', // Reduced image size
              height: '100%', // Reduced image size
              objectFit: 'contain' // Changed to contain to fit the smaller size
            }}
          />
          {/* Glow Effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            boxShadow: 'inset 0 0 30px rgba(83, 180, 245, 0.3)',
            pointerEvents: 'none'
          }}></div>
        </div>

        {/* Spinning Rings Around GIF */}
        <div style={{
          position: 'absolute',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: 'rgba(83, 180, 245, 0.6)',
          animation: 'spin 4s linear infinite',
          zIndex: 4
        }}></div>
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: 'rgba(83, 180, 245, 0.3)',
          animation: 'spinReverse 5s linear infinite',
          zIndex: 4
        }}></div>

        {/* Main Title */}
        <h1 style={{
          margin: '15px 0 5px 0',
          fontSize: '32px',
          fontWeight: '700',
          color: 'rgba(255, 255, 255, 0.95)',
          fontFamily: '"Poppins", sans-serif',
          textShadow: '0 0 15px rgba(83, 180, 245, 0.6)',
          background: 'linear-gradient(90deg, rgba(83, 180, 245, 0.9), rgba(120, 210, 255, 0.9))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '1px'
        }}>
          Holidaysri
        </h1>

        {/* Sri Lanka Message */}
        <p style={{
          margin: '10px 0 25px 0',
          fontSize: '18px',
          color: 'rgba(200, 220, 240, 0.9)',
          fontFamily: '"Poppins", sans-serif',
          maxWidth: '300px',
          lineHeight: '1.5',
          position: 'relative'
        }}>
          <span style={{
            position: 'relative',
            display: 'inline-block'
          }}>
            Trying to Give Your Hand
            <span style={{
              position: 'absolute',
              bottom: '-5px',
              left: 0,
              width: '100%',
              height: '2px',
              background: 'rgba(83, 180, 245, 0.5)',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              animation: 'underlineExpand 2s ease-in-out infinite alternate'
            }}></span>
          </span>
          <br />
          <span style={{
            color: 'rgba(83, 180, 245, 0.95)',
            fontWeight: '600',
            textShadow: '0 0 10px rgba(83, 180, 245, 0.5)',
            display: 'inline-block',
            marginTop: '5px',
            animation: 'textPulse 2s ease-in-out infinite'
          }}>Sri Lanka</span>
        </p>

        {/* Modern Loader */}
        <div style={{
          position: 'relative',
          width: '150px',
          height: '4px',
          background: 'rgba(83, 180, 245, 0.2)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginTop: '15px'
        }}>
          <div style={{
            position: 'absolute',
            height: '100%',
            width: '30%',
            background: 'linear-gradient(90deg, transparent, rgba(83, 180, 245, 0.8), transparent)',
            borderRadius: '2px',
            animation: 'loadingBar 2s ease-in-out infinite',
            boxShadow: '0 0 15px rgba(83, 180, 245, 0.7)',
            filter: 'blur(1px)'
          }}></div>
        </div>

        {/* Loading Text */}
        <p style={{
          margin: '15px 0 0 0',
          fontSize: '14px',
          color: 'rgba(150, 180, 210, 0.8)',
          fontFamily: '"Poppins", sans-serif',
          letterSpacing: '2px',
          animation: 'fadePulse 1.5s ease-in-out infinite'
        }}>
          LOADING YOUR JOURNEY
        </p>
      </div>

      {/* Keyframes for Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes spinReverse {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }

          @keyframes loadingBar {
            0% { left: -30%; }
            100% { left: 130%; }
          }

          @keyframes float {
            0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(20px) scale(0.5); opacity: 0; }
          }

          @keyframes pulse {
            0% { box-shadow: 0 0 30px rgba(83, 180, 245, 0.4); transform: scale(1); }
            50% { box-shadow: 0 0 50px rgba(83, 180, 245, 0.6); transform: scale(1.02); }
            100% { box-shadow: 0 0 30px rgba(83, 180, 245, 0.4); transform: scale(1); }
          }

          @keyframes textPulse {
            0% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.9; }
          }

          @keyframes fadePulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }

          @keyframes underlineExpand {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;