// Voice utility using ElevenLabs API via server endpoint for realistic text-to-speech

import { projectId, publicAnonKey } from './supabase/info';

let isVoiceEnabled = true;
let currentAudio: HTMLAudioElement | null = null;
let lastSpokenText = '';
let lastSpokenTime = 0;
let elevenLabsDisabled = false; // Track if ElevenLabs is unavailable
let isMobileDevice = false;

// Detect mobile/tablet devices
const detectMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
};

// Initialize on load
if (typeof window !== 'undefined') {
  isMobileDevice = detectMobile();
  console.log('🎤 Device type:', isMobileDevice ? 'Mobile/Tablet' : 'Desktop');
}

export const setVoiceEnabled = (enabled: boolean) => {
  isVoiceEnabled = enabled;
  localStorage.setItem('voiceEnabled', enabled ? 'true' : 'false');
};

export const getVoiceEnabled = (): boolean => {
  const stored = localStorage.getItem('voiceEnabled');
  if (stored === null) return true; // Default to enabled
  return stored === 'true';
};

export const speak = async (text: string, rate: number = 1.0) => {
  console.log('🎤 speak() called with text:', text, 'on device:', isMobileDevice ? 'Mobile/Tablet' : 'Desktop');
  
  if (!isVoiceEnabled && !getVoiceEnabled()) {
    console.log('🎤 Voice is disabled');
    return;
  }
  
  // Debounce: prevent speaking the same text too rapidly
  const now = Date.now();
  if (text === lastSpokenText && now - lastSpokenTime < 300) {
    console.log('🎤 Debounced - same text too soon');
    return;
  }
  lastSpokenText = text;
  lastSpokenTime = now;

  // Stop any currently playing audio gracefully
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.src = ''; // Clear source to stop loading
    } catch (e) {
      // Ignore errors from pausing
    }
    currentAudio = null;
  }

  // On mobile, use browser speech directly for better compatibility
  // Mobile browsers often have restrictions on audio playback
  if (isMobileDevice || elevenLabsDisabled) {
    console.log('🎤 Using browser speech (mobile or ElevenLabs disabled)');
    speakWithBrowser(text, rate);
    return;
  }

  try {
    // Call server endpoint to generate speech using ElevenLabs (desktop only)
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-67fdf3bb/elevenlabs/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      
      // Check if it's a 401 error (API key issue) - disable ElevenLabs permanently for this session
      if (response.status === 401) {
        elevenLabsDisabled = true;
        console.log('🎤 ElevenLabs unavailable, using browser speech synthesis');
      }
      
      // Fallback to browser speech synthesis
      speakWithBrowser(text, rate);
      return;
    }

    // Get audio blob from response
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Adjust playback rate
    audio.playbackRate = rate;
    
    // Track if this audio is cancelled before it starts playing
    let isCancelled = false;
    
    // Cleanup function
    const cleanup = () => {
      URL.revokeObjectURL(audioUrl);
      if (currentAudio === audio) {
        currentAudio = null;
      }
    };
    
    // Set up event handlers BEFORE playing
    audio.onended = cleanup;
    
    audio.onerror = () => {
      cleanup();
      if (!isCancelled) {
        speakWithBrowser(text, rate);
      }
    };
    
    // Play the audio
    try {
      const playPromise = audio.play();
      
      // Only set as current audio AFTER play starts successfully
      if (playPromise !== undefined) {
        await playPromise;
        // Check if we were cancelled while waiting for play to start
        if (currentAudio === null) {
          currentAudio = audio;
        } else {
          // We were interrupted by another speak call
          isCancelled = true;
          audio.pause();
          cleanup();
          return;
        }
      } else {
        currentAudio = audio;
      }
    } catch (playError) {
      // Only log and fallback if it's not an abort error
      if (playError instanceof Error && playError.name !== 'AbortError') {
        speakWithBrowser(text, rate);
      }
      cleanup();
      return;
    }
    
  } catch (error) {
    // Fallback to browser speech synthesis
    speakWithBrowser(text, rate);
  }
};

// Fallback to browser's built-in speech synthesis
const speakWithBrowser = (text: string, rate: number = 1.0) => {
  const synth = window.speechSynthesis;
  
  // Cancel any ongoing speech
  synth.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  
  // Adjust rate for mobile - mobile voices often sound better at slightly different speeds
  if (isMobileDevice) {
    utterance.rate = rate * 0.9; // Slightly slower on mobile for clarity
    utterance.pitch = 1.1; // Slightly higher pitch for friendliness
  } else {
    utterance.rate = rate * 0.85; // Slow down by 15% - less rushed, more natural
    utterance.pitch = 1.15; // Slightly higher pitch - friendlier, less robotic
  }
  
  utterance.volume = 1.0;
  
  utterance.onerror = (event) => {
    console.log('🎤 Speech synthesis error:', event);
  };
  
  // Mobile-optimized voice selection
  const selectVoice = () => {
    const voices = synth.getVoices();
    
    if (voices.length === 0) return false;
    
    console.log(`🎤 Available voices: ${voices.length}`);
    
    // Enhanced priority list - optimized for mobile
    const voicePriority = isMobileDevice ? [
      // iOS voices (best quality on iPhone/iPad)
      'Samantha (Enhanced)',
      'Ava (Enhanced)',
      'Samantha',
      'Ava',
      'Karen',
      'Moira',
      
      // Google voices (excellent on Android)
      'Google US English',
      'Google UK English Female',
      'en-US-language',
      'en-us',
      
      // Samsung voices (Android)
      'Samsung en-US',
      
      // Any US English voice
    ] : [
      // Desktop priority list
      'Samantha (Enhanced)',
      'Ava (Enhanced)',
      'Allison (Enhanced)',
      'Susan (Enhanced)',
      'Tom (Enhanced)',
      'Samantha',
      'Ava',
      'Alex',
      'Karen',
      'Moira',
      'Tessa',
      'Google US English',
      'Google UK English Female',
      'Google UK English Male',
      'Microsoft Zira - English (United States)',
      'Microsoft David - English (United States)',
      'Microsoft Mark - English (United States)',
    ];
    
    // Try to find voice by exact name match first
    for (const voiceName of voicePriority) {
      const voice = voices.find(v => v.name === voiceName);
      if (voice) {
        utterance.voice = voice;
        console.log('🎤 Using voice:', voice.name);
        return true;
      }
    }
    
    // Fallback 1: Find any enhanced/premium voice
    const enhancedVoice = voices.find(voice => 
      voice.lang.startsWith('en') && (
        voice.name.includes('Enhanced') ||
        voice.name.includes('Premium') ||
        voice.name.includes('Natural')
      )
    );
    
    if (enhancedVoice) {
      utterance.voice = enhancedVoice;
      console.log('🎤 Using enhanced voice:', enhancedVoice.name);
      return true;
    }
    
    // Fallback 2: Find Google voice (usually good quality)
    const googleVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Google')
    );
    
    if (googleVoice) {
      utterance.voice = googleVoice;
      console.log('🎤 Using Google voice:', googleVoice.name);
      return true;
    }
    
    // Fallback 3: Any US English voice
    const usVoice = voices.find(voice => voice.lang.startsWith('en-US'));
    if (usVoice) {
      utterance.voice = usVoice;
      console.log('🎤 Using fallback voice:', usVoice.name);
      return true;
    }
    
    // Fallback 4: Any English voice
    const anyEnglish = voices.find(voice => voice.lang.startsWith('en'));
    if (anyEnglish) {
      utterance.voice = anyEnglish;
      console.log('🎤 Using any English voice:', anyEnglish.name);
      return true;
    }
    
    console.log('🎤 Using default system voice');
    return false;
  };
  
  // Initialize voices if needed
  const voices = synth.getVoices();
  
  if (voices.length > 0) {
    selectVoice();
    // On mobile, add a small delay before speaking for better reliability
    if (isMobileDevice) {
      setTimeout(() => synth.speak(utterance), 50);
    } else {
      synth.speak(utterance);
    }
  } else {
    // Wait for voices to load (common on mobile/Chrome)
    const voicesChangedHandler = () => {
      selectVoice();
      // On mobile, add a small delay before speaking
      if (isMobileDevice) {
        setTimeout(() => synth.speak(utterance), 50);
      } else {
        synth.speak(utterance);
      }
    };
    
    // Try both events for better browser compatibility
    synth.addEventListener('voiceschanged', voicesChangedHandler, { once: true });
    
    // Fallback: try speaking anyway after a short delay (mobile Safari workaround)
    setTimeout(() => {
      const currentVoices = synth.getVoices();
      if (currentVoices.length === 0) {
        console.log('🎤 No voices loaded yet, speaking anyway...');
        synth.speak(utterance);
      }
    }, isMobileDevice ? 200 : 100);
  }
};

// Initialize voice state from localStorage
isVoiceEnabled = getVoiceEnabled();