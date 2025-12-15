import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { getVoiceEnabled, setVoiceEnabled } from "../utils/voice";

export function VoiceToggle() {
  const [isEnabled, setIsEnabled] = useState(getVoiceEnabled());

  useEffect(() => {
    setIsEnabled(getVoiceEnabled());
  }, []);

  const toggleVoice = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    setVoiceEnabled(newState);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleVoice}
        size="lg"
        className={`rounded-full w-16 h-16 shadow-lg ${
          isEnabled 
            ? 'bg-blue-500 hover:bg-blue-600' 
            : 'bg-gray-400 hover:bg-gray-500'
        }`}
        title={isEnabled ? 'Voice On - Click to Mute' : 'Voice Off - Click to Enable'}
      >
        {isEnabled ? (
          <Volume2 className="w-6 h-6" />
        ) : (
          <VolumeX className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
}
