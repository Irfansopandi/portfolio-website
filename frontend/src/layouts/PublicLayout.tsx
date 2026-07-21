import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarsBackground from '../components/StarsBackground';

const PublicLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative bg-transparent">
      {/* Background Starry Animation */}
      <StarsBackground />

      <Navbar />
      
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
