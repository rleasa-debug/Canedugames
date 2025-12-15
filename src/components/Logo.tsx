export function Logo({ className }: { className?: string }) {
  return (
    <svg 
      width="200" 
      height="200" 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Maple Leaf Background Circle */}
      <circle cx="100" cy="100" r="95" fill="#FF4444" opacity="0.9"/>
      <circle cx="100" cy="100" r="85" fill="#ffffff" opacity="0.2"/>
      
      {/* Simplified Maple Leaf */}
      <g transform="translate(100, 100)">
        {/* Center */}
        <path 
          d="M 0,-40 L 8,-10 L 25,-15 L 10,0 L 30,15 L 8,10 L 10,40 L 0,25 L -10,40 L -8,10 L -30,15 L -10,0 L -25,-15 L -8,-10 Z" 
          fill="#ffffff" 
          stroke="#FFD700" 
          strokeWidth="2"
        />
      </g>
      
      {/* CAN|EDU Text */}
      <text 
        x="100" 
        y="165" 
        fontFamily="Arial, sans-serif" 
        fontSize="24" 
        fontWeight="bold" 
        textAnchor="middle" 
        fill="#333333"
      >
        CAN|EDU
      </text>
      <text 
        x="100" 
        y="185" 
        fontFamily="Arial, sans-serif" 
        fontSize="12" 
        textAnchor="middle" 
        fill="#666666"
      >
        GAMES
      </text>
    </svg>
  );
}
