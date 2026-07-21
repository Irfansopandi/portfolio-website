import { useEffect, useRef } from 'react';

const StarsBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Adjust canvas resolution on resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Star class definition
    class Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
      color: string;

      vx: number;
      vy: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = 0.5 + Math.random() * 1.5;
        this.opacity = Math.random();
        this.twinkleSpeed = (0.003 + Math.random() * 0.007) * (Math.random() > 0.5 ? 1 : -1);
        
        // Curated cosmic palette for stars (white, soft indigo, blue)
        const colors = ['#ffffff', '#e0e7ff', '#c7d2fe', '#818cf8', '#a78bfa'];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Slow cosmic drift velocities (drifting slightly down and left/right to look like space travel)
        this.vx = (Math.random() - 0.5) * 0.1;
        this.vy = 0.05 + Math.random() * 0.15;
      }

      update() {
        this.opacity += this.twinkleSpeed;
        if (this.opacity > 1) {
          this.opacity = 1;
          this.twinkleSpeed = -Math.abs(this.twinkleSpeed);
        } else if (this.opacity < 0.1) {
          this.opacity = 0.1;
          this.twinkleSpeed = Math.abs(this.twinkleSpeed);
        }

        // Apply slow drift motion
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around when moving off-screen
        if (this.x < 0) {
          this.x = width;
          this.y = Math.random() * height;
        } else if (this.x > width) {
          this.x = 0;
          this.y = Math.random() * height;
        }

        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        } else if (this.y > height) {
          this.y = 0;
          this.x = Math.random() * width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Number of stars relative to screen size
    const starCount = Math.floor((width * height) / 9000);
    const stars: Star[] = Array.from({ length: starCount }, () => new Star());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // We let the CSS wrapper div handle the solid dark color
      // Canvas only draws the stars to avoid layout blocking
      stars.forEach((star) => {
        star.update();
        star.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none w-full h-full"
      style={{ opacity: 0.8, zIndex: -1 }}
    />
  );
};

export default StarsBackground;
