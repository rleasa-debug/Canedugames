import { useState, useEffect } from 'react';
import { Brain, Sparkles, GraduationCap, BookOpen, Calculator, Globe, Music, Shapes, Clock, BookText, Volume2, LogOut, Crown, UserCog, Trophy, MapPin, Anchor, BarChart3, Menu, X } from "lucide-react";
import { Toaster, toast } from 'sonner';
import { projectId } from './utils/supabase/info';
import { supabase } from './utils/supabase/client';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { TextWithVoice } from './components/TextWithVoice';
import { ScoreProvider, useScore } from './contexts/ScoreContext';
import { TypingGame } from './components/TypingGame';
import { SentenceStars as SentenceGame } from './components/SentenceStars';
import { SpellingGame } from './components/SpellingGame';
import { MathGame } from './components/MathGame';
import { GeographyQuiz as GeographyGame } from './components/GeographyQuiz';
import { ReadingGame } from './components/ReadingGame';
import { PhonicsGame } from './components/PhonicsGame';
import { PatternRecognition as PatternGame } from './components/PatternRecognition';
import { TimesTablesPractice as TimesTablesGame } from './components/TimesTablesPractice';
import { StorySequencing as StoryGame } from './components/StorySequencing';
import { RhymingGame } from './components/RhymingGame';
import { PrefixSuffixGame } from './components/PrefixSuffixGame';
import { ShapeComparisonGame } from './components/ShapeComparisonGame';
import { MappingMapleLeaf as MapleLeafGame } from './components/MappingMapleLeaf';
import { ISpyWords as ISpyWordsGame } from './components/ISpyWords';
import { VowelSoundsSorting as VowelSoundsGame } from './components/VowelSoundsSorting';
import { AngleBisectorGame } from './components/AngleBisectorGame';
import { FactorBattleship as FactorBattleshipGame } from './components/FactorBattleship';
import { ChartInterpretation as ChartInterpretationGame } from './components/ChartInterpretation';
import { MazeGame } from './components/MazeGame';
import { MathMatchingGame } from './components/MathMatchingGame';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import SubscriptionModal from './components/SubscriptionModal';

type GameType = "home" | "typing" | "sentence" | "spelling" | "math" | "geography" | "reading" | "phonics" | "pattern" | "timestables" | "story" | "rhyming" | "prefixsuffix" | "shapecomparison" | "mapleleaf" | "ispywords" | "vowelsounds" | "anglebisector" | "factorbattleship" | "chartinterpretation" | "maze" | "mathmatching" | "privacy" | "terms" | "curriculum";

interface Game {
  id: GameType;
  title: string;
  description: string;
  icon: any;
  category: 'literacy' | 'numeracy';
  requiredLevel?: number;
  imageUrl?: string;
}

const games: Game[] = [
  { id: "typing", title: "Northern Typing Trail", description: "Master keyboard skills through Canadian adventures", icon: BookOpen, category: 'literacy', requiredLevel: 1, imageUrl: "https://images.unsplash.com/photo-1671505392704-534b7e31245b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMG1vdW50YWlucyUyMGZvcmVzdHxlbnwxfHx8fDE3Njc3MTIyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "sentence", title: "Sentence Builder Bay", description: "Construct perfect sentences by the shore", icon: BookText, category: 'literacy', requiredLevel: 1, imageUrl: "https://images.unsplash.com/photo-1767417243390-dcbe2d0ceed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMGNvYXN0bGluZSUyMG9jZWFufGVufDF8fHx8MTc2NzcxMjIyNXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "spelling", title: "Rocky Mountain Spelling", description: "Conquer peaks with perfect spelling", icon: Sparkles, category: 'literacy', requiredLevel: 1, imageUrl: "https://images.unsplash.com/photo-1671505392704-534b7e31245b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMG1vdW50YWlucyUyMGZvcmVzdHxlbnwxfHx8fDE3Njc3MTIyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "math", title: "Arctic Addition", description: "Solve math problems in the frozen north", icon: Calculator, category: 'numeracy', requiredLevel: 1, imageUrl: "https://images.unsplash.com/photo-1607603757070-f1ca64e16137?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMHdpbnRlciUyMHNub3d8ZW58MXx8fHwxNzY3NzEyMjI2fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "geography", title: "Canadian Geography Quest", description: "Explore provinces, capitals, and landmarks", icon: Globe, category: 'literacy', requiredLevel: 2, imageUrl: "https://images.unsplash.com/photo-1709627127863-f5d869b21f35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMGxha2UlMjBuYXR1cmV8ZW58MXx8fHwxNzY3NzEyMjI1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "reading", title: "Forest Reading Comprehension", description: "Journey through stories in Canadian forests", icon: BookOpen, category: 'literacy', requiredLevel: 2, imageUrl: "https://images.unsplash.com/photo-1664755312678-f5ccef00a24e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMGF1dHVtbiUyMGZvcmVzdHxlbnwxfHx8fDE3Njc3MTIyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "phonics", title: "Prairie Phonics", description: "Sound out words across the grasslands", icon: Volume2, category: 'literacy', requiredLevel: 1, imageUrl: "https://images.unsplash.com/photo-1711530388583-04a3a17be96f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMHByYWlyaWUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzY3NzEyMjI2fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "pattern", title: "Pattern Recognition Rapids", description: "Navigate through pattern challenges", icon: Shapes, category: 'numeracy', requiredLevel: 2, imageUrl: "https://images.unsplash.com/photo-1709627127863-f5d869b21f35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMGxha2UlMjBuYXR1cmV8ZW58MXx8fHwxNzY3NzEyMjI1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "timestables", title: "Times Tables Tundra", description: "Master multiplication in the Arctic", icon: Clock, category: 'numeracy', requiredLevel: 3, imageUrl: "https://images.unsplash.com/photo-1678152574522-d74b92fc3b77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMHR1bmRyYSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3Njc3MTIyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "story", title: "Coastal Story Sequencing", description: "Order events along the Pacific coast", icon: BookText, category: 'literacy', requiredLevel: 3, imageUrl: "https://images.unsplash.com/photo-1767417243390-dcbe2d0ceed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMGNvYXN0bGluZSUyMG9jZWFufGVufDF8fHx8MTc2NzcxMjIyNXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "rhyming", title: "Rhyming Rivers", description: "Flow through rhymes and rhythms", icon: Music, category: 'literacy', requiredLevel: 2, imageUrl: "https://images.unsplash.com/photo-1709627127863-f5d869b21f35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMGxha2UlMjBuYXR1cmV8ZW58MXx8fHwxNzY3NzEyMjI1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "prefixsuffix", title: "Prefix & Suffix Summit", description: "Scale word-building mountains", icon: GraduationCap, category: 'literacy', requiredLevel: 4, imageUrl: "https://images.unsplash.com/photo-1671505392704-534b7e31245b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMG1vdW50YWlucyUyMGZvcmVzdHxlbnwxfHx8fDE3Njc3MTIyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "shapecomparison", title: "Shape Comparison Coast", description: "Compare geometric shapes by the shore", icon: Shapes, category: 'numeracy', requiredLevel: 3, imageUrl: "https://images.unsplash.com/photo-1767417243390-dcbe2d0ceed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMGNvYXN0bGluZSUyMG9jZWFufGVufDF8fHx8MTc2NzcxMjIyNXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "mapleleaf", title: "Maple Leaf Math", description: "Count and calculate with Canada's symbol", icon: MapPin, category: 'numeracy', requiredLevel: 2, imageUrl: "https://images.unsplash.com/photo-1664755312678-f5ccef00a24e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMGF1dHVtbiUyMGZvcmVzdHxlbnwxfHx8fDE3Njc3MTIyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "ispywords", title: "I Spy Words Wilderness", description: "Spot sight words in the wild", icon: Sparkles, category: 'literacy', requiredLevel: 2, imageUrl: "https://images.unsplash.com/photo-1664755312678-f5ccef00a24e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMGF1dHVtbiUyMGZvcmVzdHxlbnwxfHx8fDE3Njc3MTIyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "vowelsounds", title: "Vowel Sounds Valley", description: "Master vowel sounds through the valleys", icon: Volume2, category: 'literacy', requiredLevel: 3, imageUrl: "https://images.unsplash.com/photo-1671505392704-534b7e31245b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMG1vdW50YWlucyUyMGZvcmVzdHxlbnwxfHx8fDE3Njc3MTIyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "anglebisector", title: "Angle Bisector Archipelago", description: "Divide angles across island chains", icon: Shapes, category: 'numeracy', requiredLevel: 5, imageUrl: "https://images.unsplash.com/photo-1767417243390-dcbe2d0ceed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMGNvYXN0bGluZSUyMG9jZWFufGVufDF8fHx8MTc2NzcxMjIyNXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "factorbattleship", title: "Factor Battleship Bay", description: "Navigate factors across Atlantic waters", icon: Anchor, category: 'numeracy', requiredLevel: 4, imageUrl: "https://images.unsplash.com/photo-1767417243390-dcbe2d0ceed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMGNvYXN0bGluZSUyMG9jZWFufGVufDF8fHx8MTc2NzcxMjIyNXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "chartinterpretation", title: "Chart Interpretation Channel", description: "Read data through Canadian straits", icon: BarChart3, category: 'numeracy', requiredLevel: 4, imageUrl: "https://images.unsplash.com/photo-1647227305418-cad4fb924ebf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMG5vcnRoZXJuJTIwbGlnaHRzfGVufDF8fHx8MTc2NzcxMjIyN3ww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "maze", title: "Labyrinth Lake", description: "Navigate through watery mazes", icon: MapPin, category: 'literacy', requiredLevel: 3, imageUrl: "https://images.unsplash.com/photo-1709627127863-f5d869b21f35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMGxha2UlMjBuYXR1cmV8ZW58MXx8fHwxNzY3NzEyMjI1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "mathmatching", title: "Math Matching Maritimes", description: "Match equations by the Atlantic", icon: Calculator, category: 'numeracy', requiredLevel: 2, imageUrl: "https://images.unsplash.com/photo-1767417243390-dcbe2d0ceed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGlhbiUyMGNvYXN0bGluZSUyMG9jZWFufGVufDF8fHx8MTc2NzcxMjIyNXww&ixlib=rb-4.1.0&q=80&w=1080" },
];

function AppContent() {
  const [currentGame, setCurrentGame] = useState<GameType>("home");
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentLevel, stats } = useScore();

  useEffect(() => {
    console.log("🚀 App v1.4 loaded");
    toast.success("System Updated to v1.4", { duration: 5000 });
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus(session.user.id);
      } else {
        setIsPremium(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkPremiumStatus = async (userId: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/subscription/status`, {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      const data = await response.json();
      setIsPremium(data.isPremium || false);
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsPremium(false);
  };

  const renderGame = () => {
    switch (currentGame) {
      case "typing": return <TypingGame onBack={() => setCurrentGame("home")} />;
      case "sentence": return <SentenceGame onBack={() => setCurrentGame("home")} />;
      case "spelling": return <SpellingGame onBack={() => setCurrentGame("home")} />;
      case "math": return <MathGame onBack={() => setCurrentGame("home")} />;
      case "geography": return <GeographyGame onBack={() => setCurrentGame("home")} />;
      case "reading": return <ReadingGame onBack={() => setCurrentGame("home")} />;
      case "phonics": return <PhonicsGame onBack={() => setCurrentGame("home")} />;
      case "pattern": return <PatternGame onBack={() => setCurrentGame("home")} />;
      case "timestables": return <TimesTablesGame onBack={() => setCurrentGame("home")} />;
      case "story": return <StoryGame onBack={() => setCurrentGame("home")} />;
      case "rhyming": return <RhymingGame onBack={() => setCurrentGame("home")} />;
      case "prefixsuffix": return <PrefixSuffixGame onBack={() => setCurrentGame("home")} />;
      case "shapecomparison": return <ShapeComparisonGame onBack={() => setCurrentGame("home")} />;
      case "mapleleaf": return <MapleLeafGame onBack={() => setCurrentGame("home")} />;
      case "ispywords": return <ISpyWordsGame onBack={() => setCurrentGame("home")} />;
      case "vowelsounds": return <VowelSoundsGame onBack={() => setCurrentGame("home")} />;
      case "anglebisector": return <AngleBisectorGame onBack={() => setCurrentGame("home")} />;
      case "factorbattleship": return <FactorBattleshipGame onBack={() => setCurrentGame("home")} />;
      case "chartinterpretation": return <ChartInterpretationGame onBack={() => setCurrentGame("home")} />;
      case "maze": return <MazeGame onBack={() => setCurrentGame("home")} />;
      case "mathmatching": return <MathMatchingGame onBack={() => setCurrentGame("home")} />;
      case "privacy":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
              <button onClick={() => setCurrentGame("home")} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">← Back to Home</button>
              <h1 className="text-3xl mb-6">Privacy Policy</h1>
              <div className="prose max-w-none">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <h2>Information We Collect</h2>
                <p>We collect minimal information necessary to provide our educational services, including email addresses for account creation and learning progress data.</p>
                <h2>How We Use Your Information</h2>
                <p>Your information is used solely to provide and improve our educational games and track learning progress.</p>
                <h2>Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information.</p>
                <h2>Contact Us</h2>
                <p>For privacy questions, please contact us through our website.</p>
              </div>
            </div>
          </div>
        );
      case "terms":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
              <button onClick={() => setCurrentGame("home")} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">← Back to Home</button>
              <h1 className="text-3xl mb-6">Terms of Service</h1>
              <div className="prose max-w-none">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <h2>Acceptance of Terms</h2>
                <p>By accessing CAN|EDU Games, you agree to these terms of service.</p>
                <h2>Use of Service</h2>
                <p>Our educational games are provided for learning purposes. All games are free to play, with optional premium analytics features.</p>
                <h2>Subscriptions</h2>
                <p>Premium subscriptions are billed annually at $14.99/year and provide ad-free access plus advanced analytics.</p>
                <h2>User Conduct</h2>
                <p>Users must not misuse our services or attempt to interfere with their operation.</p>
              </div>
            </div>
          </div>
        );
      case "curriculum":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
              <button onClick={() => setCurrentGame("home")} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">← Back to Home</button>
              <h1 className="text-3xl mb-6">Curriculum Alignment</h1>
              <div className="prose max-w-none">
                <h2>Canadian Curriculum Standards</h2>
                <p>CAN|EDU Games aligns with provincial curriculum standards across Canada, covering key competencies in literacy and numeracy.</p>
                <h2>Literacy Skills</h2>
                <ul>
                  <li>Phonics and phonemic awareness</li>
                  <li>Reading comprehension</li>
                  <li>Spelling and vocabulary</li>
                  <li>Sentence construction</li>
                  <li>Word families and patterns</li>
                </ul>
                <h2>Numeracy Skills</h2>
                <ul>
                  <li>Basic arithmetic operations</li>
                  <li>Times tables and multiplication</li>
                  <li>Pattern recognition</li>
                  <li>Geometric shapes and comparisons</li>
                  <li>Data interpretation and charts</li>
                </ul>
                <h2>Progressive Learning</h2>
                <p>Our 10-level system ensures students master foundational skills before advancing to more complex concepts.</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                <div className="flex justify-between items-center">
                  {/* Logo and Title */}
                  <div className="flex items-center gap-2 md:gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                    >
                      <ImageWithFallback src="/logo.png" alt="CAN|EDU Games Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                    </motion.div>
                    <div>
                      <h1 className="text-xl md:text-3xl flex items-center gap-2">
                        <TextWithVoice>CAN|EDU Games</TextWithVoice>
                        <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full border border-green-200 shadow-sm" title="Current Version">v1.4</span>
                      </h1>
                      <p className="text-xs text-gray-600 hidden md:block">Canadian Curriculum Education</p>
                    </div>
                  </div>

                  {/* Desktop Navigation */}
                  <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
                      <Trophy className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">Level {currentLevel}</span>
                    </div>
                    
                    {!user ? (
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Sign In
                      </button>
                    ) : (
                      <>
                        {!isPremium && (
                          <button
                            onClick={() => setShowSubscriptionModal(true)}
                            className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center gap-2"
                          >
                            <Crown className="w-4 h-4" />
                            Go Premium
                          </button>
                        )}
                        {isPremium && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg">
                            <Crown className="w-4 h-4" />
                            <span className="text-sm">Premium</span>
                          </div>
                        )}
                        <button
                          onClick={() => setShowProfileModal(true)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <UserCog className="w-6 h-6 text-gray-600" />
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <LogOut className="w-6 h-6 text-gray-600" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                  {mobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="md:hidden mt-4 pb-4 border-t pt-4"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
                          <Trophy className="w-5 h-5 text-blue-600" />
                          <span className="text-sm">Level {currentLevel}</span>
                        </div>
                        
                        {!user ? (
                          <button
                            onClick={() => {
                              setShowAuthModal(true);
                              setMobileMenuOpen(false);
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Sign In
                          </button>
                        ) : (
                          <>
                            {!isPremium && (
                              <button
                                onClick={() => {
                                  setShowSubscriptionModal(true);
                                  setMobileMenuOpen(false);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center gap-2 justify-center"
                              >
                                <Crown className="w-4 h-4" />
                                Go Premium
                              </button>
                            )}
                            {isPremium && (
                              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg justify-center">
                                <Crown className="w-4 h-4" />
                                <span className="text-sm">Premium</span>
                              </div>
                            )}
                            <button
                              onClick={() => {
                                setShowProfileModal(true);
                                setMobileMenuOpen(false);
                              }}
                              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 justify-center"
                            >
                              <UserCog className="w-5 h-5" />
                              Profile
                            </button>
                            <button
                              onClick={() => {
                                handleSignOut();
                                setMobileMenuOpen(false);
                              }}
                              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 justify-center"
                            >
                              <LogOut className="w-5 h-5" />
                              Sign Out
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-5xl mb-4">
                  <TextWithVoice>Explore Canadian Learning Adventures</TextWithVoice>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Master literacy and numeracy through engaging games aligned with Canadian curriculum standards
                </p>
              </motion.div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {games.map((game, index) => {
                  const Icon = game.icon;
                  const isLocked = game.requiredLevel && game.requiredLevel > currentLevel;
                  
                  return (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={!isLocked ? { scale: 1.03, y: -5 } : {}}
                      className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all ${
                        isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl'
                      }`}
                      onClick={() => !isLocked && setCurrentGame(game.id)}
                    >
                      {/* Image Header */}
                      <div className="relative h-40 overflow-hidden">
                        <ImageWithFallback 
                          src={game.imageUrl || ''} 
                          alt={game.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-start justify-between">
                          <div className={`p-2.5 rounded-lg backdrop-blur-sm ${
                            game.category === 'literacy' ? 'bg-blue-500/90' : 'bg-green-500/90'
                          }`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          {isLocked && (
                            <div className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-900/80 backdrop-blur-sm rounded-lg text-xs text-white font-medium">
                              <span>🔒 Level {game.requiredLevel}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">{game.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{game.description}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                            game.category === 'literacy' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {game.category === 'literacy' ? 'Literacy' : 'Numeracy'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* AdSense - only for non-premium users */}
              {user && !isPremium && (
                <div className="mb-8 bg-white rounded-lg shadow p-4 text-center">
                  <ins className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-6720906990095142"
                    data-ad-slot="1234567890"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
                </div>
              )}

              {/* Footer Links */}
              <footer className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                  <button onClick={() => setCurrentGame("privacy")} className="hover:text-blue-600 transition-colors">Privacy Policy</button>
                  <button onClick={() => setCurrentGame("terms")} className="hover:text-blue-600 transition-colors">Terms of Service</button>
                  <button onClick={() => setCurrentGame("curriculum")} className="hover:text-blue-600 transition-colors">Curriculum Alignment</button>
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">
                  © {new Date().getFullYear()} CAN|EDU Games. All rights reserved. (v1.4)
                </p>
              </footer>
            </main>

            {/* Modals */}
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            <ProfileModal 
              isOpen={showProfileModal} 
              onClose={() => setShowProfileModal(false)}
              isPremium={isPremium}
              onUpgrade={() => {
                setShowProfileModal(false);
                setShowSubscriptionModal(true);
              }}
            />
            <SubscriptionModal 
              isOpen={showSubscriptionModal} 
              onClose={() => setShowSubscriptionModal(false)}
              onSuccess={() => {
                setShowSubscriptionModal(false);
                checkPremiumStatus(user.id);
              }}
            />
          </div>
        );
    }
  };

  return renderGame();
}

export default function App() {
  return (
    <ScoreProvider>
      <Toaster position="top-center" richColors />
      <AppContent />
    </ScoreProvider>
  );
}