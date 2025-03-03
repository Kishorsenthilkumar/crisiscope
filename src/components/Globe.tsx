
import React, { useEffect, useRef } from 'react';

export const Globe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Globe properties
    const globeRadius = Math.min(canvas.width / 4, canvas.height / 4);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Crisis hotspots (longitude, latitude, intensity)
    const hotspots = [
      { long: 20, lat: 10, intensity: 0.8 },
      { long: -80, lat: 40, intensity: 0.6 },
      { long: 120, lat: -20, intensity: 0.7 },
      { long: -20, lat: -30, intensity: 0.5 },
      { long: 80, lat: 35, intensity: 0.9 },
    ];
    
    // Animation variables
    let rotation = 0;
    
    // Draw globe function
    const drawGlobe = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw globe outline
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)'; // Dark blue background
      ctx.fill();
      
      // Draw grid lines
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)'; // Light grid lines
      ctx.lineWidth = 1;
      
      // Draw latitude lines
      for (let lat = -90; lat <= 90; lat += 15) {
        const radius = Math.cos((lat * Math.PI) / 180) * globeRadius;
        const y = centerY + Math.sin((lat * Math.PI) / 180) * globeRadius;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw longitude lines
      for (let long = 0; long < 360; long += 15) {
        const adjustedLong = (long + rotation) % 360;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - globeRadius);
        ctx.bezierCurveTo(
          centerX + globeRadius * Math.sin((adjustedLong * Math.PI) / 180),
          centerY,
          centerX + globeRadius * Math.sin((adjustedLong * Math.PI) / 180),
          centerY,
          centerX,
          centerY + globeRadius
        );
        ctx.stroke();
      }
      
      // Draw hotspots
      hotspots.forEach(spot => {
        const adjustedLong = (spot.long + rotation) % 360;
        // Only draw if on visible side of globe (based on longitude)
        if (adjustedLong > 90 && adjustedLong < 270) return;
        
        const x = centerX + Math.cos((spot.lat * Math.PI) / 180) * Math.sin((adjustedLong * Math.PI) / 180) * globeRadius;
        const y = centerY + Math.sin((spot.lat * Math.PI) / 180) * globeRadius;
        
        // Hotspot size based on intensity
        const radius = 5 + spot.intensity * 15;
        
        // Create gradient for hotspot
        const gradient = ctx.createRadialGradient(x, y, 2, x, y, radius);
        
        // Color based on intensity
        let color = '#FF4A4A'; // High (red)
        if (spot.intensity < 0.6) color = '#2EC4B6'; // Low (green)
        else if (spot.intensity < 0.8) color = '#FF9F45'; // Medium (orange)
        
        gradient.addColorStop(0, `${color}`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Rotate globe for next frame
      rotation += 0.1;
      
      // Request next frame
      requestAnimationFrame(drawGlobe);
    };
    
    // Start animation
    drawGlobe();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full rounded-full"
    />
  );
};
