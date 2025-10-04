export default function Footer() {
  return (
    <footer className="relative border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-[40px] py-[80px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px] mb-[40px]">
          {/* Brand */}
          <div>
            <a href="#" className="text-2xl font-bold inline-block mb-4">
              <span className="text-foreground">dis</span>
              <span className="text-primary">-</span>
              <span className="text-foreground">linkedin</span>
            </a>
            <p className="text-foreground/60 text-sm">
              Express your true feelings on LinkedIn.
              Track what the community really thinks.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-foreground/60 hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-foreground/60 hover:text-foreground transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-[40px] border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-[20px] text-sm text-foreground/60">
          <p>© 2025 dis-linkedin. All rights reserved.</p>
          <p>
            Icons from{' '}
            <a
              href="https://pixeliconlibrary.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Pixel Icon Library
            </a>
            {' '}by HackerNoon
          </p>
        </div>
      </div>
    </footer>
  );
}
