import { speak } from "../utils/voice";
import { ReactNode, useState } from "react";

interface TextWithVoiceProps {
  children: ReactNode;
  className?: string;
}

export function TextWithVoice({ children, className = "" }: TextWithVoiceProps) {
  const [activeTap, setActiveTap] = useState<number | null>(null);
  const [lastTouchTime, setLastTouchTime] = useState<number>(0);

  // Convert children to string properly, handling arrays and React elements
  const getTextContent = (node: ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getTextContent).join('');
    if (node && typeof node === 'object' && 'props' in node) {
      return getTextContent(node.props.children);
    }
    return '';
  };
  
  const text = getTextContent(children);
  
  // Only split into words if it's actual text content
  if (!text || text.trim() === '') {
    return <span className={className}>{children}</span>;
  }
  
  const words = text.split(' ');
  
  // Handle word speaking - optimized for mobile/tablet touch (including iPad Chrome)
  const handleWordClick = (word: string, idx: number) => {
    // Prevent double-firing: if a touch just happened, ignore the click
    const now = Date.now();
    if (now - lastTouchTime < 500) {
      console.log('🎤 Ignoring click - touch event just fired');
      return;
    }
    
    console.log('🎤 Word clicked:', word);
    
    // Visual feedback for tap
    setActiveTap(idx);
    setTimeout(() => setActiveTap(null), 400);
    
    // Speak the word (remove punctuation)
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    console.log('🎤 Speaking:', cleanWord);
    speak(cleanWord);
  };
  
  const handleTouch = (word: string, idx: number, e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Record touch time to prevent double-firing with click
    setLastTouchTime(Date.now());
    
    console.log('🎤 Word touched:', word);
    
    // Visual feedback for tap
    setActiveTap(idx);
    setTimeout(() => setActiveTap(null), 400);
    
    // Speak the word (remove punctuation)
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    console.log('🎤 Speaking:', cleanWord);
    speak(cleanWord);
  };
  
  const handleMouseEnter = (word: string) => {
    // Only on desktop (devices with fine pointer)
    if (window.matchMedia('(pointer: fine)').matches) {
      const cleanWord = word.replace(/[.,!?;:]/g, '');
      speak(cleanWord);
    }
  };
  
  return (
    <span className={className}>
      {words.map((word, idx) => (
        <span 
          key={idx} 
          onMouseEnter={() => handleMouseEnter(word)}
          onClick={() => {
            console.log('🎤 Word tapped/clicked:', word);
            
            // Visual feedback for tap
            setActiveTap(idx);
            setTimeout(() => setActiveTap(null), 400);
            
            // Speak the word (remove punctuation)
            const cleanWord = word.replace(/[.,!?;:]/g, '');
            console.log('🎤 Speaking:', cleanWord);
            speak(cleanWord);
          }}
          className={`
            inline-block cursor-pointer touch-manipulation select-none
            hover:underline hover:decoration-2 hover:text-purple-600 
            active:text-purple-700 active:scale-110
            transition-all duration-150
            ${activeTap === idx ? 'text-purple-700 scale-110 underline decoration-2' : ''}
          `}
          style={{
            // Ensure tappable area on mobile/tablet
            minWidth: '24px',
            minHeight: '24px',
            display: 'inline-block',
            marginRight: idx < words.length - 1 ? '0.25em' : '0', // Single space between words
            WebkitTapHighlightColor: 'rgba(147, 51, 234, 0.3)',
            // Prevent text selection on mobile
            WebkitUserSelect: 'none',
            userSelect: 'none',
            // Improve touch responsiveness
            touchAction: 'manipulation',
            // Prevent callout on iOS
            WebkitTouchCallout: 'none',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}