import React from 'react';
import formatBytes from './formatBytes';

const CircularProgress = ({
  percentage,
  size = 180,
  strokeWidth = 10,
  title = "Transferring...",
  fileCount = 0,
  uploadedSize = "0",
  totalSize = "0",
  onClick
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-card p-8 max-w-md w-[90%] mx-auto" style={{ animation: "pulse-glow 4s ease-in-out infinite" }}>
      <div className="flex flex-col items-center space-y-5">
        <div className="relative inline-flex items-center justify-center mb-2">
          <svg className="transform -rotate-90" width={size} height={size}>
            <circle
              strokeWidth={strokeWidth}
              stroke="rgba(255,255,255,0.06)"
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            <circle
              className="transition-all duration-500 ease-out"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke="url(#progressGradient)"
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {percentage}
            </span>
            <span className="text-lg text-white/40">%</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white/90">
          {percentage == 100 ? "Transfer Complete!" : title}
        </h2>

        <p className="text-emerald-400/80 text-sm">
          {percentage == 100 ? "Sent" : "Sending"} {fileCount} {fileCount === 1 ? 'file' : 'files'}
        </p>
        <p className="text-white/50 text-sm">
          {formatBytes(percentage == 100 ? totalSize : uploadedSize)} of {formatBytes(totalSize)} uploaded
        </p>

        {percentage == 100 && (
          <button
            onClick={onClick}
            className="mt-3 w-full py-3 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
          >
            Upload more?
          </button>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;