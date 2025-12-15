import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { LucideIcon } from "lucide-react";
import { TextWithVoice } from "./TextWithVoice";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  image?: string;
}

export function GameCard({ title, description, icon: Icon, color, onClick, image }: GameCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full" onClick={onClick}>
      {/* Canadian Nature Image */}
      {image && (
        <div className="relative h-40 overflow-hidden">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className={`absolute bottom-2 left-2 w-10 h-10 rounded-lg ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="mb-2"><TextWithVoice>{title}</TextWithVoice></h3>
        <p className="text-gray-600 mb-4 flex-grow"><TextWithVoice>{description}</TextWithVoice></p>
        <Button variant="outline" className="w-full">
          <TextWithVoice>Play Now</TextWithVoice>
        </Button>
      </div>
    </Card>
  );
}