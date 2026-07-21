import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    const timer1 = setTimeout(() => setPhase(1), 600);
    const timer2 = setTimeout(() => setPhase(2), 1400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)' } as any}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background grid */}
        <div className="absolute inset-0 grid-bg opacity-30" />

        {/* Floating orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8, bounce: 0.4 }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                boxShadow: '0 0 40px rgba(99, 102, 241, 0.6), 0 0 80px rgba(168, 85, 247, 0.3)',
              }}
            >
              IS
            </div>
            {/* Rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-transparent"
            style={{ borderTopColor: '#6366f1', borderRightColor: '#a855f7' } as any}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>

          {/* Name */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                  <span className="gradient-text">IRFAN SOPANDI</span>
                </h1>
                <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">
                  Web Development
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading bar */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '280px' }}
                transition={{ duration: 0.3 }}
                className="w-72"
              >
                <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
                  <span>Loading portfolio...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
                      boxShadow: '0 0 10px rgba(99, 102, 241, 0.8)',
                    } as any}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 2 === 0 ? '#6366f1' : '#a855f7',
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 3) * 20}%`,
              } as any}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
