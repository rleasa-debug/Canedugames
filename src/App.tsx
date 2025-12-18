import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ScoreProvider, useScore } from "./contexts/ScoreContext";
import { ProgressionProvider } from "./contexts/ProgressionContext";
import { Auth } from "./components/Auth";
import { ScoreDisplay } from "./components/ScoreDisplay";
import { TextWithVoice } from "./components/TextWithVoice";
import { VoiceToggle } from "./components/VoiceToggle";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Button } from "./components/ui/button";
import { AdminDashboard } from "./components/AdminDashboard";
import { PremiumUpgrade } from "./components/PremiumUpgrade";
import { AdBanner } from "./components/AdBanner";
import { AdSenseScript, AdSenseBanner } from "./components/GoogleAdSense";
import { SubscriptionSuccess } from "./components/SubscriptionSuccess";
import { TypingTest } from "./components/TypingTest";
import { SpellingBee } from "./components/SpellingBee";
import { MathQuiz } from "./components/MathQuiz";
import { MazeGame } from "./components/MazeGame";
import { MathMatchingGame } from "./components/MathMatchingGame";
import { ReadingComprehension } from "./components/ReadingComprehension";
import { SentenceStars } from "./components/SentenceStars";
import { GeographyQuiz } from "./components/GeographyQuiz";
import { PhonicsGame } from "./components/PhonicsGame";
import { PatternRecognition } from "./components/PatternRecognition";
import { TimesTablesPractice } from "./components/TimesTablesPractice";
import { StorySequencing } from "./components/StorySequencing";
import { RhymingGame } from "./components/RhymingGame";
import { PrefixSuffixGame } from "./components/PrefixSuffixGame";
import { ShapeComparisonGame } from "./components/ShapeComparisonGame";
import { MappingMapleLeaf } from "./components/MappingMapleLeaf";
import WordFamilyKeys from "./components/games/WordFamilyKeys";
import { ISpyWords } from "./components/ISpyWords";
import { VowelSoundsSorting } from "./components/VowelSoundsSorting";
import { AngleBisectorGame } from "./components/AngleBisectorGame";
import { FactorBattleship } from "./components/FactorBattleship";
import { ChartInterpretation } from "./components/ChartInterpretation";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { TermsOfService } from "./components/TermsOfService";
import { CurriculumInfo } from "./components/CurriculumInfo";
import { Brain, Sparkles, GraduationCap, BookOpen, Calculator, Globe, Music, Shapes, Clock, BookText, Volume2, LogOut, Crown, UserCog, Trophy, MapPin, Anchor, BarChart3 } from "lucide-react";
import { supabase } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';
import logo from "figma:asset/9f7277dc3b6010e16e010377e1ae5232b1fea571.png";

type GameType = "home" | "typing" | "sentence" | "spelling" | "math" | "geography" | "reading" | "phonics" | "pattern" | "timestables" | "story" | "rhyming" | "prefixsuffix" | "shapecomparison" | "mapleleaf" | "wordfamilykeys" | "ispywords" | "vowelsounds" | "anglebisector" | "factorbattleship" | "chartinterpretation" | "maze" | "mathmatching" | "privacy" | "terms" | "curriculum";

// TEMPORARILY DISABLED - Ready to implement when needed
// Free games (no subscription required)
// const FREE_GAMES: GameType[] = ["reading", "typing", "spelling"];

// Main App Content Component
function AppContent() {
  // Get score data from context
  const { setAccessToken, literacyCorrect, literacyTotal, numeracyCorrect, numeracyTotal, sessionTime } = useScore();
  const [currentGame, setCurrentGame] = useState<GameType>("home");
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        setAccessTokenState(session.access_token);
        setAccessToken(session.access_token);
        setUserName(session.user?.user_metadata?.name || session.user?.email?.split('@')[0] || 'Student');
        setUserEmail(session.user?.email || '');
        
        // Check if user is admin (has 'admin' or 'teacher' in email)
        const email = session.user?.email?.toLowerCase() || '';
        const adminAccess = email.includes('admin') || email.includes('teacher') || email === 'r.leasa@tvdsb.ca';
        setIsAdmin(adminAccess);

        // Check premium status
        try {
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/subscription/status`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          });
          const data = await response.json();
          setIsPremium(data.isPremium || false);
        } catch (error) {
          console.error('Error checking premium status:', error);
        }
      }
      
      setCheckingAuth(false);
    };

    checkSession();
  }, [setAccessToken]);

  // Check for success redirect from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    
    if (sessionId && accessToken) {
      setShowSuccess(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Refresh premium status after 2 seconds
      setTimeout(async () => {
        try {
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/subscription/status`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          setIsPremium(data.isPremium || false);
        } catch (error) {
          console.error('Error refreshing premium status:', error);
        }
      }, 2000);
    }
  }, [accessToken]);

  const handleAuthSuccess = async (token: string, name: string) => {
    setAccessTokenState(token);
    setAccessToken(token);
    setUserName(name);
    
    // Get user email and check admin status
    const { data: { user } } = await supabase.auth.getUser(token);
    if (user?.email) {
      setUserEmail(user.email);
      const email = user.email.toLowerCase();
      const adminAccess = email.includes('admin') || email.includes('teacher') || email === 'r.leasa@tvdsb.ca';
      setIsAdmin(adminAccess);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAccessTokenState(null);
    setAccessToken(null);
    setUserName("");
    setUserEmail("");
    setIsAdmin(false);
    setCurrentGame("home");
  };

  const handleGameSelect = (game: GameType) => {
    // TEMPORARILY DISABLED - Game access control for when we re-enable premium features
    // if (!FREE_GAMES.includes(game) && !isPremium) {
    //   setShowUpgrade(true);
    // } else {
      setCurrentGame(game);
    // }
  };

  // Show loading screen while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg animate-pulse">
            <span className="text-4xl">🍁</span>
          </div>
          <div className="text-2xl text-gray-700 mb-2">Loading...</div>
          <div className="text-sm text-gray-500">Preparing your learning adventure</div>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!accessToken) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Wrap content with ProgressionProvider now that we have accessToken
  return (
    <ProgressionProvider accessToken={accessToken}>
      {renderContent()}
    </ProgressionProvider>
  );

  function renderContent() {
    // Admin users see ONLY the admin dashboard (no games)
    if (isAdmin) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          {/* Header */}
          <header className="bg-white border-b-4 border-yellow-400 shadow-md">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
              <div className="flex justify-between items-center">
                {/* Logo and Title */}
                <div className="flex items-center gap-2 md:gap-4">
                  <ImageWithFallback src={logo} alt="CAN|EDU Games Logo" className="w-16 h-16 md:w-24 md:h-24 object-contain" />
                  <div>
                    <h1 className="text-xl md:text-3xl">
                      <TextWithVoice>CAN|EDU Games - Admin</TextWithVoice>
                    </h1>
                    <p className="text-xs text-gray-600 hidden md:block">Administrator Dashboard</p>
                  </div>
                </div>
                
                {/* Desktop Sign Out */}
                <div className="hidden md:flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Logged in as: <span className="font-semibold">{userEmail}</span>
                  </div>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>

                {/* Mobile Sign Out */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="md:hidden"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile User Email */}
              <div className="md:hidden mt-2 text-xs text-gray-600">
                {userEmail}
              </div>
            </div>
          </header>

          {/* Admin Dashboard - Always Visible for Admins */}
          <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <UserCog className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
                <div>
                  <h2 className="text-2xl md:text-3xl">
                    <TextWithVoice>Administrator Dashboard</TextWithVoice>
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600">
                    <TextWithVoice>View and manage all student data</TextWithVoice>
                  </p>
                </div>
              </div>
              <AdminDashboard onClose={() => {}} accessToken={accessToken} embedded={true} />
            </div>
          </main>

          <VoiceToggle />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-md">
          {/* Top Header Row */}
          <div className="border-b-4 border-yellow-400">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2 md:gap-4">
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 15,
                    transition: { duration: 0.3, type: "spring", stiffness: 300 }
                  }}
                  className="cursor-pointer"
                >
                  <div className="relative">
                    <ImageWithFallback src={logo} alt="CAN|EDU Games Logo" className="w-16 h-16 md:w-24 md:h-24 object-contain relative z-10" />
                    {/* Glowing halo effect */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-yellow-400 rounded-full blur-xl"
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                >
                  <motion.h1 
                    className="text-2xl md:text-3xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-black drop-shadow-lg">
                      <TextWithVoice>CAN|EDU Games</TextWithVoice>
                    </span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-xs font-bold text-gray-700"
                  >
                    🍁 Canadian Curriculum Learning 🍁
                  </motion.p>
                  <motion.button
                    onClick={() => handleGameSelect("curriculum" as GameType)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-xs text-purple-600 hover:text-purple-700 underline transition-colors mt-1"
                  >
                    Uniquely Canadian. Universally Yours.
                  </motion.button>
                </motion.div>
              </div>
              
              {/* User Actions */}
              <div className="flex items-center gap-2 md:gap-4">
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAdmin(true)}
                    className="hidden md:flex"
                  >
                    <UserCog className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Full-Width Score Bar - NOW TRULY OUTSIDE header so it can stick! */}
        <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-yellow-50 via-white to-yellow-50 border-b-2 border-yellow-300">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
            <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
              {/* Session Timer */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <div className="text-sm sm:text-base text-purple-600 font-semibold">
                  <TextWithVoice>Time</TextWithVoice>
                  <span className="ml-1.5">
                    <TextWithVoice>
                      {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
                    </TextWithVoice>
                  </span>
                </div>
              </div>

              {/* Literacy Score */}
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <div className="text-sm sm:text-base text-blue-600 font-semibold">
                  <TextWithVoice>Literacy</TextWithVoice>
                  <span className="ml-1.5">
                    <TextWithVoice>{literacyCorrect}/{literacyTotal}</TextWithVoice>
                  </span>
                </div>
              </div>

              {/* Numeracy Score */}
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                <div className="text-sm sm:text-base text-red-600 font-semibold">
                  <TextWithVoice>Numeracy</TextWithVoice>
                  <span className="ml-1.5">
                    <TextWithVoice>{numeracyCorrect}/{numeracyTotal}</TextWithVoice>
                  </span>
                </div>
              </div>

              {/* Accuracy Score */}
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                <div className="text-sm sm:text-base text-gray-700 font-semibold">
                  <TextWithVoice>Accuracy</TextWithVoice>
                  <span className="ml-1.5">
                    {(() => {
                      const totalCorrect = literacyCorrect + numeracyCorrect;
                      const totalQuestions = literacyTotal + numeracyTotal;
                      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
                      return <TextWithVoice>{accuracy}%</TextWithVoice>;
                    })()}
                  </span>
                </div>
              </div>

              {/* Action Buttons from ScoreDisplay */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ScoreDisplay accessToken={accessToken} mobileBar={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-6 text-center">
          {currentGame === "home" && (
            <HomeScreen onSelectGame={handleGameSelect} userName={userName} />
          )}
          {currentGame === "typing" && <TypingTest onBack={() => setCurrentGame("home")} />}
          {currentGame === "spelling" && <SpellingBee onBack={() => setCurrentGame("home")} />}
          {currentGame === "math" && <MathQuiz onBack={() => setCurrentGame("home")} />}
          {currentGame === "reading" && <ReadingComprehension onBack={() => setCurrentGame("home")} />}
          {currentGame === "sentence" && <SentenceStars onBack={() => setCurrentGame("home")} />}
          {currentGame === "geography" && <GeographyQuiz onBack={() => setCurrentGame("home")} />}
          {currentGame === "phonics" && <PhonicsGame onBack={() => setCurrentGame("home")} />}
          {currentGame === "pattern" && <PatternRecognition onBack={() => setCurrentGame("home")} />}
          {currentGame === "timestables" && <TimesTablesPractice onBack={() => setCurrentGame("home")} />}
          {currentGame === "story" && <StorySequencing onBack={() => setCurrentGame("home")} />}
          {currentGame === "rhyming" && <RhymingGame onBack={() => setCurrentGame("home")} />}
          {currentGame === "prefixsuffix" && <PrefixSuffixGame onBack={() => setCurrentGame("home")} />}
          {currentGame === "shapecomparison" && <ShapeComparisonGame onBack={() => setCurrentGame("home")} />}
          {currentGame === "mapleleaf" && <MappingMapleLeaf onBack={() => setCurrentGame("home")} />}
          {currentGame === "wordfamilykeys" && <WordFamilyKeys onBack={() => setCurrentGame("home")} />}
          {currentGame === "ispywords" && <ISpyWords onBack={() => setCurrentGame("home")} />}
          {currentGame === "vowelsounds" && <VowelSoundsSorting onBack={() => setCurrentGame("home")} />}
          {currentGame === "anglebisector" && <AngleBisectorGame onBack={() => setCurrentGame("home")} />}
          {currentGame === "factorbattleship" && <FactorBattleship onBack={() => setCurrentGame("home")} />}
          {currentGame === "chartinterpretation" && <ChartInterpretation onBack={() => setCurrentGame("home")} />}
          {currentGame === "maze" && <MazeGame onBack={() => setCurrentGame("home")} />}
          {currentGame === "mathmatching" && <MathMatchingGame onBack={() => setCurrentGame("home")} />}
          {currentGame === "privacy" && <PrivacyPolicy onBack={() => setCurrentGame("home")} />}
          {currentGame === "terms" && <TermsOfService onBack={() => setCurrentGame("home")} />}
          {currentGame === "curriculum" && <CurriculumInfo onBack={() => setCurrentGame("home")} />}
        </main>

        <VoiceToggle />
        
        {/* Ad Banner for Free Users */}
        <AdBanner 
          onUpgradeClick={() => setShowUpgrade(true)} 
          isPremium={isPremium} 
          position="bottom"
        />
        
        {/* Admin Dashboard */}
        {showAdmin && accessToken && (
          <AdminDashboard onClose={() => setShowAdmin(false)} accessToken={accessToken} />
        )}
        
        {/* Premium Upgrade Modal */}
        {showUpgrade && (
          <PremiumUpgrade onClose={() => setShowUpgrade(false)} accessToken={accessToken} />
        )}

        {/* Subscription Success Modal */}
        {showSuccess && (
          <SubscriptionSuccess onContinue={() => {
            setShowSuccess(false);
            setIsPremium(true);
          }} />
        )}
      </div>
    );
  }
}

export default function App() {
  // Google AdSense integration - Ads show to free users only
  return (
    <ScoreProvider>
      <AdSenseScript />
      <AppContent />
    </ScoreProvider>
  );
}

// Home Screen Component
interface HomeScreenProps {
  onSelectGame: (game: GameType) => void;
  userName: string;
}

function HomeScreen({ onSelectGame, userName }: HomeScreenProps) {
  const games = [
    { 
      id: "reading", 
      name: "Rocky Mountain Reading", 
      icon: BookOpen, 
      color: "from-blue-500 to-blue-600", 
      category: "Literacy",
      image: "https://images.unsplash.com/photo-1516472406811-52ae4782e9a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NreSUyMG1vdW50YWlucyUyMGNhbmFkYXxlbnwxfHx8fDE3NjQ4OTM5NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "typing", 
      name: "Typing on the Tundra", 
      icon: BookText, 
      color: "from-green-500 to-green-600", 
      category: "Literacy",
      image: "https://images.unsplash.com/photo-1678152574522-d74b92fc3b77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5hZGlhbiUyMHR1bmRyYSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQ4OTM5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "spelling", 
      name: "Spelling in the Spruce Forest", 
      icon: Sparkles, 
      color: "from-purple-500 to-purple-600", 
      category: "Literacy",
      image: "https://images.unsplash.com/photo-1642175944646-3e539201b2ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJ1Y2UlMjBmb3Jlc3QlMjBjYW5hZGF8ZW58MXx8fHwxNzY0ODkzOTcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "phonics", 
      name: "Phonics by the Pacific", 
      icon: Volume2, 
      color: "from-pink-500 to-pink-600", 
      category: "Literacy",
      image: "https://images.unsplash.com/photo-1597859566993-f7f55a55084e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNpZmljJTIwb2NlYW4lMjBjYW5hZGF8ZW58MXx8fHwxNzY0ODkzOTcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "rhyming", 
      name: "Rhyming on the Rivers", 
      icon: Music, 
      color: "from-indigo-500 to-indigo-600", 
      category: "Literacy",
      image: "https://images.unsplash.com/photo-1621437736468-273d8a6d5851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5hZGlhbiUyMHJpdmVyJTIwbmF0dXJlfGVufDF8fHx8MTc2NDg5Mzk3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "sentence", 
      name: "Sentence Building in Saskatchewan", 
      icon: BookOpen, 
      color: "from-yellow-500 to-yellow-600", 
      category: "Literacy",
      image: "https://images.unsplash.com/photo-1621621245759-3ddd5977072b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXNrYXRjaGV3YW4lMjBwcmFpcmllfGVufDF8fHx8MTc2NDg5Mzk3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "math", 
      name: "Counting in the Canadian Shield", 
      icon: Calculator, 
      color: "from-red-500 to-red-600", 
      category: "Numeracy",
      image: "https://images.unsplash.com/photo-1666033390776-2dc8c6f6a2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5hZGlhbiUyMHNoaWVsZCUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQ4OTM5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "timestables", 
      name: "Times Tables in Toronto", 
      icon: Clock, 
      color: "from-orange-500 to-orange-600", 
      category: "Numeracy",
      image: "https://images.unsplash.com/photo-1559869824-929df9dab35e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3JvbnRvJTIwc2t5bGluZXxlbnwxfHx8fDE3NjQ4OTM5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "pattern", 
      name: "Patterns on the Prairies", 
      icon: Shapes, 
      color: "from-teal-500 to-teal-600", 
      category: "Numeracy",
      image: "https://images.unsplash.com/photo-1621571388119-305d3f26efef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmFpcmllJTIwZ3Jhc3NsYW5kJTIwY2FuYWRhfGVufDF8fHx8MTc2NDg5Mzk3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "shapecomparison", 
      name: "Shape Sorting in the Saguenay", 
      icon: Shapes, 
      color: "from-cyan-500 to-cyan-600", 
      category: "Numeracy",
      image: "https://images.unsplash.com/photo-1703596057479-a692cbea83eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWd1ZW5heSUyMGZqb3JkJTIwY2FuYWRhfGVufDF8fHx8MTc2NDg5Mzk3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "geography", 
      name: "Geography of the Great Lakes", 
      icon: Globe, 
      color: "from-emerald-500 to-emerald-600", 
      category: "Social Studies",
      image: "https://images.unsplash.com/photo-1643686600571-7b8bb670a6f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVhdCUyMGxha2VzJTIwY2FuYWRhfGVufDF8fHx8MTc2NDg5Mzk3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "story", 
      name: "Story Time in the North", 
      icon: BookText, 
      color: "from-violet-500 to-violet-600", 
      category: "Literacy",
      image: "https://images.unsplash.com/photo-1648607560570-4ee80c5914c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGNhbmFkYSUyMGF1cm9yYXxlbnwxfHx8fDE3NjQ4OTM5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "mapleleaf", 
      name: "Maple Leaf Mapping", 
      icon: MapPin, 
      color: "from-red-500 to-red-600", 
      category: "Social Studies",
      image: "https://images.unsplash.com/photo-1637783038917-c8d883362ca1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5hZGElMjBtYXAlMjBmbGFnfGVufDF8fHx8MTc2NDk2MjIxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "wordfamilykeys", 
      name: "Word Families in Whistler", 
      icon: BookOpen, 
      color: "from-blue-500 to-blue-600", 
      category: "Literacy",
      image: "https://images.unsplash.com/photo-1561134643-668f9057cce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5mZiUyMG5hdGlvbmFsJTIwcGFya3xlbnwxfHx8fDE3NjQ5ODE5OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "ispywords", 
      name: "I Spy Words in the Wilderness", 
      icon: BookText, 
      color: "from-green-500 to-green-600", 
      category: "Literacy",
      image: "https://images.unsplash.com/photo-1644615750278-d27c53d59eda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5hZGlhbiUyMHdpbGRlcm5lc3MlMjBsYWtlfGVufDF8fHx8MTc2NDk4MTk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "vowelsounds", 
      name: "Vowel Sounds at Niagara Falls", 
      icon: Music, 
      color: "from-cyan-500 to-cyan-600", 
      category: "Literacy",
      image: "https://images.unsplash.com/photo-1633365001422-89037c8ae1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWFnYXJhJTIwZmFsbHMlMjBjYW5hZGF8ZW58MXx8fHwxNzY0OTgxOTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "anglebisector", 
      name: "Angles in the Appalachians", 
      icon: Shapes, 
      color: "from-purple-500 to-purple-600", 
      category: "Numeracy",
      image: "https://images.unsplash.com/photo-1707536484356-86ca44981e49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5hZGlhbiUyMGZvcmVzdCUyMHdpbGRsaWZlfGVufDF8fHx8MTc2NDk4MTk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "factorbattleship", 
      name: "Factor Battleship in the Maritimes", 
      icon: Anchor, 
      color: "from-blue-500 to-blue-600", 
      category: "Numeracy",
      image: "https://images.unsplash.com/photo-1731823425094-3a284a70c762?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5hZGlhbiUyMG1hcml0aW1lJTIwb2NlYW58ZW58MXx8fHwxNzY1MjA1NDc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "chartinterpretation", 
      name: "Chart Interpretation in the Arctic", 
      icon: BarChart3, 
      color: "from-blue-500 to-blue-600", 
      category: "Numeracy",
      image: "https://images.unsplash.com/photo-1570667303213-409ddca8753c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5hZGlhbiUyMGFyY3RpYyUyMGljZXxlbnwxfHx8fDE3NjUyMDYzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "maze", 
      name: "Maze Navigator in Nunavut", 
      icon: Shapes, 
      color: "from-indigo-500 to-indigo-600", 
      category: "Numeracy",
      image: "https://images.unsplash.com/photo-1664339361775-e18fee9b2af2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5dWtvbiUyMHRlcnJpdG9yeSUyMGNhbmFkYXxlbnwxfHx8fDE3NjUzOTA2NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    { 
      id: "mathmatching", 
      name: "Math Matching in the Yukon", 
      icon: Shapes, 
      color: "from-pink-500 to-pink-600", 
      category: "Numeracy",
      image: "https://images.unsplash.com/photo-1664339361775-e18fee9b2af2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5dWtvbiUyMHRlcnJpdG9yeSUyMGNhbmFkYXxlbnwxfHx8fDE3NjUzOTA2NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
  ] as const;

  const categories = [
    { name: "Literacy", icon: BookOpen, color: "text-blue-600", bgColor: "bg-blue-50" },
    { name: "Numeracy", icon: Calculator, color: "text-red-600", bgColor: "bg-red-50" },
    { name: "Social Studies", icon: Globe, color: "text-green-600", bgColor: "bg-green-50" }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl border-2 border-white/50"
      >
        <div className="relative z-10 text-center space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-6xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
          >
            <TextWithVoice>Welcome back {userName}!</TextWithVoice>
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-2xl text-gray-700 max-w-3xl mx-auto"
          >
            <TextWithVoice>Choose from 20 engaging educational games designed for Canadian students</TextWithVoice>
          </motion.h2>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: BookOpen, count: 11, label: "Literacy Games", color: "from-blue-500 to-blue-600", delay: 0.5 },
              { icon: Calculator, count: 9, label: "Numeracy Games", color: "from-red-500 to-red-600", delay: 0.6 },
              { icon: Globe, count: 2, label: "Geography Games", color: "from-green-500 to-green-600", delay: 0.7 }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: stat.delay + 0.2, type: "spring", stiffness: 200 }}
                      className="text-2xl font-bold text-gray-800"
                    >
                      {stat.count}
                    </motion.div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Games by Category */}
      {categories.map((category, categoryIndex) => {
        const categoryGames = games.filter(g => g.category === category.name);
        
        return (
          <motion.div 
            key={category.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + (categoryIndex * 0.2), duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-14 h-14 rounded-2xl ${category.bgColor} flex items-center justify-center shadow-sm`}
              >
                <category.icon className={`w-7 h-7 ${category.color}`} />
              </motion.div>
              <div>
                <h2 className="text-3xl md:text-4xl">
                  <TextWithVoice>{category.name} Games</TextWithVoice>
                </h2>
                <p className="text-sm text-gray-600">
                  {categoryGames.length} engaging games to master {category.name.toLowerCase()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryGames.map((game, gameIndex) => {
                return (
                <motion.button
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 1 + (categoryIndex * 0.2) + (gameIndex * 0.05),
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectGame(game.id as GameType)}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Beautiful Canadian Image Background */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback 
                      src={game.image} 
                      alt={game.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-50 group-hover:opacity-40 transition-opacity duration-300`}></div>
                    
                    {/* Category Badge */}
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-lg bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center`}
                    >
                      {game.category === 'Literacy' && <BookOpen className="w-5 h-5 text-blue-600" />}
                      {game.category === 'Numeracy' && <Calculator className="w-5 h-5 text-red-600" />}
                      {game.category === 'Social Studies' && <Globe className="w-5 h-5 text-green-600" />}
                    </motion.div>
                  </div>
                  
                  <div className="p-6 flex flex-col items-center justify-center text-center min-h-[100px]">
                    <h3 className="text-xl font-semibold group-hover:text-purple-600 transition-colors duration-300">
                      <TextWithVoice>{game.name}</TextWithVoice>
                    </h3>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs font-semibold text-purple-600 mt-3"
                    >
                      Play Now →
                    </motion.div>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <motion.div 
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "200%" }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
                    />
                  </div>
                </motion.button>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* Bottom CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="mt-20 text-center space-y-8"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl px-8 py-5 shadow-lg border-2 border-purple-100 cursor-default"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain className="w-6 h-6 text-purple-600" />
          </motion.div>
          <p className="text-lg text-gray-700">
            <TextWithVoice>Keep learning and growing every day! 🌟</TextWithVoice>
          </p>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600"
        >
          <button
            onClick={() => onSelectGame("privacy" as GameType)}
            className="hover:text-purple-600 transition-colors underline"
          >
            Privacy Policy
          </button>
          <span className="text-gray-400">•</span>
          <button
            onClick={() => onSelectGame("terms" as GameType)}
            className="hover:text-purple-600 transition-colors underline"
          >
            Terms of Service
          </button>
          <span className="text-gray-400">•</span>
          <span>© 2024 CAN|EDU Games</span>
        </motion.div>
      </motion.div>
    </div>
  );
}