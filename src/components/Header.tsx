import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <nav className="container mx-auto px-[40px] py-[20px]">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-foreground">dis</span>
            <span className="text-primary">-</span>
            <span className="text-foreground">linkedin</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-[40px]">
            {isLandingPage && !user && (
              <>
                <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
                  How It Works
                </a>
              </>
            )}

            {user ? (
              <>
                <Link to="/feed" className="text-foreground/80 hover:text-foreground transition-colors">
                  Feed
                </Link>
                <span className="text-sm text-foreground/60">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="px-[40px] py-[20px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 card-corners relative"
                >
                  <span className="corner-bottom-left">+</span>
                  <span className="corner-bottom-right">+</span>
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                className="px-[40px] py-[20px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 card-corners relative"
              >
                <span className="corner-bottom-left">+</span>
                <span className="corner-bottom-right">+</span>
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground">
            <i className="hn hn-menu text-2xl"></i>
          </button>
        </div>
      </nav>
    </header>
  );
}
