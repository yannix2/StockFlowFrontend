// components/charts.tsx
"use client";

import { useTheme } from "next-themes";

interface LineChartProps {
  data: { name: string; value: number }[];
  colors: string[];
  darkMode?: boolean;
}

export function LineChart({ data, colors, darkMode }: LineChartProps) {
  const { theme } = useTheme();
  
  // Simple SVG-based line chart (replace with real chart library if needed)
  return (
    <div className="w-full h-full">
      <svg viewBox="0 0 300 150" className="w-full h-full">
        {/* X-axis */}
       <line
  x1="20"
  y1="130"
  x2="280"
  y2="130"
  stroke={darkMode || theme === 'dark' ? '#374151' : '#E5E7EB'}
  strokeWidth="1"
  suppressHydrationWarning
/>

        
        {/* Y-axis */}
        <line 
          x1="20" y1="20" 
          x2="20" y2="130" 
          stroke={darkMode || theme === "dark" ? "#374151" : "#E5E7EB"} 
          strokeWidth="1"
        />
        
        {/* Sample line - replace with real data mapping */}
        <polyline
          fill="none"
          stroke={colors[0]}
          strokeWidth="2"
          points="20,100 80,40 140,80 200,20 260,60"
        />
      </svg>
    </div>
  );
}