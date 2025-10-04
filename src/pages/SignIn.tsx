import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-[40px] py-[80px]">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-[40px]">
          <CardHeader className="p-0 mb-[40px] text-center">
            <CardTitle className="text-4xl mb-[20px]">
              <span className="text-foreground">dis</span>
              <span className="text-primary">-</span>
              <span className="text-foreground">linkedin</span>
            </CardTitle>
            <p className="text-foreground/60 text-base">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </p>
          </CardHeader>

          <CardContent className="p-0">
            {/* Tab Toggle */}
            <div className="grid grid-cols-2 gap-[20px] mb-[40px]">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`px-[20px] py-[20px] border card-corners relative transition-colors ${
                  !isSignUp
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'border-foreground/20 text-foreground/60 hover:border-foreground/40'
                }`}
              >
                <span className="corner-bottom-left">+</span>
                <span className="corner-bottom-right">+</span>
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`px-[20px] py-[20px] border card-corners relative transition-colors ${
                  isSignUp
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'border-foreground/20 text-foreground/60 hover:border-foreground/40'
                }`}
              >
                <span className="corner-bottom-left">+</span>
                <span className="corner-bottom-right">+</span>
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-[20px]">
              <div>
                <label htmlFor="email" className="block text-sm text-foreground/80 mb-[10px]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-[20px] py-[20px] bg-background border border-foreground/20 text-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-foreground/80 mb-[10px]">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-[20px] py-[20px] bg-background border border-foreground/20 text-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm text-foreground/80 mb-[10px]">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-[20px] py-[20px] bg-background border border-foreground/20 text-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {error && (
                <div className="text-sm text-red-500 text-center p-[20px] border border-red-500/20 bg-red-500/10">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-[40px] py-[20px] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed card-corners relative"
              >
                <span className="corner-bottom-left">+</span>
                <span className="corner-bottom-right">+</span>
                {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-[40px] text-center">
              <a
                href="/"
                className="text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                ← Back to home
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
