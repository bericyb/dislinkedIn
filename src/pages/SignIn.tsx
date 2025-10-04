import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function SignIn() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithLinkedIn } = useAuth();

  const handleLinkedInSignIn = async () => {
    setError('');
    setLoading(true);

    const { error } = await signInWithLinkedIn();

    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Note: if successful, user will be redirected to LinkedIn
    // and then back to the app, so no need to handle success here
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-[40px] py-[80px]">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-[40px] h-fit">
          <CardHeader className="p-0 mb-[40px] text-center">
            <CardTitle className="text-4xl mb-[20px]">
              <span className="text-foreground">dis</span>
              <span className="text-primary">-</span>
              <span className="text-foreground">linkedin</span>
            </CardTitle>
            <p className="text-foreground/60 text-base">
              Sign in to track your LinkedIn dislikes
            </p>
          </CardHeader>

          <CardContent className="p-0">
            {error && (
              <div className="text-sm text-red-500 text-center p-[20px] border border-red-500/20 bg-red-500/10 mb-[40px]">
                {error}
              </div>
            )}

            {/* LinkedIn Sign In Button */}
            <button
              onClick={handleLinkedInSignIn}
              disabled={loading}
              className="w-full px-[40px] py-[20px] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed card-corners relative flex items-center justify-center gap-[20px]"
            >
              <span className="corner-bottom-left">+</span>
              <span className="corner-bottom-right">+</span>
              <i className="hn hn-linkedin text-2xl"></i>
              {loading ? 'Redirecting to LinkedIn...' : 'Sign in with LinkedIn'}
            </button>

            <div className="mt-[40px] text-center">
              <Link
                to="/"
                className="text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
