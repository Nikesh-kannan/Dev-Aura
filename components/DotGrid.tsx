import React, { useEffect, useRef } from 'react';

interface DotGridProps {
  color?: string;
  dotSize?: number;
  spacing?: number;
}

const DotGrid: React.FC<DotGridProps> = ({ 
  color = '#a0a0a0', 
  dotSize = 2, 
  spacing = 30 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dots: { x: number, y: number, bx: number, by: number, vx: number, vy: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDots();
    };

    const initDots = () => {
      dots = [];
      const cols = Math.ceil(canvas.width / spacing) + 2; 
      const rows = Math.ceil(canvas.height / spacing) + 2;
      
      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const x = i * spacing + spacing / 2;
          const y = j * spacing + spacing / 2;
          dots.push({ x, y, bx: x, by: y, vx: 0, vy: 0 });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
        mouseRef.current = { x: -9999, y: -9999 };
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;

      const mouse = mouseRef.current;
      const radius = 200; 
      const strength = 100; 

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let tx = dot.bx;
        let ty = dot.by;

        if (dist < radius) {
           const angle = Math.atan2(dy, dx);
           const force = (radius - dist) / radius; 
           
           tx = dot.bx - Math.cos(angle) * (force * strength);
           ty = dot.by - Math.sin(angle) * (force * strength);
        }

        dot.x += (tx - dot.x) * 0.15;
        dot.y += (ty - dot.y) * 0.15;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, dotSize, spacing]);

  return (
    <div className="dot-grid">
        <div className="dot-grid__wrap">
            <canvas ref={canvasRef} className="dot-grid__canvas" />
        </div>
    </div>
  );
};

export default DotGrid;