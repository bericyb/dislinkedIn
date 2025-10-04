export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <nav className="container mx-auto px-[40px] py-[20px]">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="text-2xl font-bold">
            <span className="text-foreground">dis</span>
            <span className="text-primary">-</span>
            <span className="text-foreground">linkedin</span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-[40px]">
            <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
              How It Works
            </a>
            <a
              href="#"
              className="px-[40px] py-[20px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 card-corners relative"
            >
              <span className="corner-bottom-left">+</span>
              <span className="corner-bottom-right">+</span>
              Login
            </a>
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
