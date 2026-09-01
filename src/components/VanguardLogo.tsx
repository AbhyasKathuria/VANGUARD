import React from "react";

interface VanguardLogoProps {
  className?: string;
  size?: number;
}

export default function VanguardLogo({ className = "", size = 32 }: VanguardLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Shield Boundary */}
      <path
        d="M24 4L8 10V22C8 32.5 14.8 42.2 24 44C33.2 42.2 40 32.5 40 22V10L24 4Z"
        fill="#262626"
        stroke="#545454"
        strokeWidth="2"
      />

      {/* Internal Routing Compass & Circuit Lines */}
      <path
        d="M24 12V36M14 24H34"
        stroke="#85e0ff"
        strokeWidth="1.5"
        strokeDasharray="2 3"
        opacity="0.6"
      />

      {/* Stylized 'V' Chevron Wings */}
      <path
        d="M15 17L24 33L33 17"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Routing Node / Beacon */}
      <circle cx="24" cy="24" r="3.5" fill="#25D366" stroke="#ffffff" strokeWidth="1.5" />

      {/* Secondary Node Coordinates */}
      <circle cx="15" cy="17" r="2" fill="#ffffff" />
      <circle cx="33" cy="17" r="2" fill="#ffffff" />
      <circle cx="24" cy="33" r="2" fill="#53bdeb" />
    </svg>
  );
}
