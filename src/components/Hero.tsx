import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-[120px]">
      <div className="container mx-auto px-[40px]">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-[40px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Finally,{' '}
            <span className="text-primary">Dislike</span>{' '}
            on LinkedIn
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-xl md:text-2xl text-foreground/70 mb-[80px] max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Express your true feelings. Track what the community really thinks.
            See the most disliked posts across LinkedIn.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-[40px] justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a
              href="#"
              className="px-[40px] py-[20px] bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold text-lg shadow-lg shadow-primary/20 flex items-center gap-[20px] card-corners relative"
            >
              <span className="corner-bottom-left">+</span>
              <span className="corner-bottom-right">+</span>
              <i className="hn hn-download text-2xl"></i>
              Download Extension
            </a>
            <Link
              to={user ? "/feed" : "/signin"}
              className="px-[40px] py-[20px] border-2 border-foreground/20 text-foreground hover:border-foreground/40 hover:bg-foreground/5 transition-all font-semibold text-lg flex items-center gap-[20px] card-corners relative"
            >
              <span className="corner-bottom-left">+</span>
              <span className="corner-bottom-right">+</span>
              <i className="hn hn-linkedin text-2xl"></i>
              {user ? 'View Feed' : 'Sign in with LinkedIn'}
            </Link>
          </motion.div>

          {/* Stats - Grid-aligned: 80px top margin (2 grid cells), 40px gap */}
          <motion.div
            className="mt-[80px] grid grid-cols-1 md:grid-cols-3 gap-[40px] max-w-[1240px] mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="p-[40px] flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-bold text-primary mb-[20px]">1+</div>
              <div className="text-sm text-foreground/60">Active Users</div>
            </Card>
            <Card className="p-[40px] flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-bold text-primary mb-[20px]">6+</div>
              <div className="text-sm text-foreground/60">Posts Disliked</div>
            </Card>
            <Card className="p-[40px] flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-bold text-primary mb-[20px]">100%</div>
              <div className="text-sm text-foreground/60">Anonymous</div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
