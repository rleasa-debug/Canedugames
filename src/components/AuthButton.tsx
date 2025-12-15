import { LogIn, LogOut, User, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { useState } from "react";
import { TextWithVoice } from "./TextWithVoice";

export function AuthButton() {
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Sign in error:', err);
      const errorMsg = err?.message || '';
      
      // Check for specific "provider not enabled" error
      if (errorMsg.includes('provider is not enabled') || errorMsg.includes('Unsupported provider')) {
        setError('Google sign-in is not configured yet. Please enable Google OAuth in your Supabase dashboard first.');
      } else {
        setError(errorMsg || 'Failed to sign in. Please try again.');
      }
    }
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={handleSignIn}
          className="bg-white hover:bg-gray-50 text-gray-800 shadow-lg border border-gray-200 flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <TextWithVoice>Sign in with Google</TextWithVoice>
        </Button>
        
        {error && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 max-w-xs shadow-lg">
            <div className="flex gap-2 items-start">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-semibold mb-1">Sign In Error</p>
                <p className="text-xs text-red-700">{error}</p>
                <p className="text-xs text-red-600 mt-2">
                  Please ensure Google OAuth is configured in your Supabase dashboard.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="relative">
        <Button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-white hover:bg-gray-50 text-gray-800 shadow-lg border border-gray-200 flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          <span className="max-w-[150px] truncate">
            <TextWithVoice>{user.name}</TextWithVoice>
          </span>
        </Button>

        {showMenu && (
          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]">
            <div className="mb-3 pb-3 border-b">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm font-semibold truncate">
                <TextWithVoice>{user.email}</TextWithVoice>
              </p>
            </div>
            <Button
              onClick={() => {
                signOut();
                setShowMenu(false);
              }}
              variant="destructive"
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <TextWithVoice>Sign Out</TextWithVoice>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}