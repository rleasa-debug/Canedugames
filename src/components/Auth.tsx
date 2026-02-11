import { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Button } from './ui/button';
import { LogIn, UserPlus, Loader2, GraduationCap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AuthProps {
  onAuthSuccess: (accessToken: string, userName: string) => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCurriculumInfo, setShowCurriculumInfo] = useState(false);

  // If showing curriculum info, return that view
  if (showCurriculumInfo) {
    const { CurriculumInfo } = require('./CurriculumInfo');
    return <CurriculumInfo onBack={() => setShowCurriculumInfo(false)} />;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call backend to create user
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Now sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      const accessToken = signInData.session?.access_token;
      const userName = signInData.user?.user_metadata?.name || email.split('@')[0];

      if (accessToken) {
        onAuthSuccess(accessToken, userName);
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Provide more helpful error messages
        if (error.message.includes('Invalid login credentials')) {
          // Auto-switch to Sign Up mode
          setIsSignUp(true);
          throw new Error('No account found with this email. Please create an account by filling out the Sign Up form below.');
        }
        throw error;
      }

      const accessToken = data.session?.access_token;
      const userName = data.user?.user_metadata?.name || email.split('@')[0];

      if (accessToken) {
        onAuthSuccess(accessToken, userName);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12 max-w-md w-full border-2 border-white/50 mx-auto"
      >
        {/* Top Curriculum Link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-6"
        >
          <motion.button
            onClick={() => setShowCurriculumInfo(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors group"
          >
            <GraduationCap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="text-lg font-semibold">
              Uniquely Canadian. Universally Yours.
            </span>
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-2"
          >
            <Button
              onClick={() => setShowCurriculumInfo(true)}
              variant="outline"
              className="text-sm px-4 py-2 rounded-full border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-colors"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center mb-4"
          >
            <ImageWithFallback
              src="/logo.png"
              alt="CAN|EDU Games Logo"
              className="w-32 h-32 object-contain"
            />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            CAN|EDU Games
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600"
          >
            Canadian Inspired Learning
          </motion.p>
        </div>

        {/* Toggle Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1"
        >
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex-1"
          >
            <Button
              onClick={() => setIsSignUp(false)}
              variant={!isSignUp ? "default" : "ghost"}
              className={`w-full transition-all duration-300 ${!isSignUp ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md font-bold' : 'text-gray-700 hover:text-gray-900 font-semibold'}`}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex-1"
          >
            <Button
              onClick={() => setIsSignUp(true)}
              variant={isSignUp ? "default" : "ghost"}
              className={`w-full transition-all duration-300 ${isSignUp ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md font-bold' : 'text-gray-700 hover:text-gray-900 font-semibold'}`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Button>
          </motion.div>
        </motion.div>

        <motion.form 
          key={isSignUp ? 'signup' : 'signin'}
          initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={isSignUp ? handleSignUp : handleSignIn} 
          className="space-y-4"
        >
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm mb-2 font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Your name"
              />
            </motion.div>
          )}

          <div>
            <label className="block text-sm mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="••••••••"
            />
            {isSignUp && (
              <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border-2 border-red-200 text-red-700 p-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 text-center text-xs text-gray-500"
        >
          {isSignUp ? (
            <p>By creating an account, you get free access to all 19 educational games!</p>
          ) : (
            <p>Welcome back! Sign in to continue your learning journey.</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}