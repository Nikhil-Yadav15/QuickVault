import React from 'react';
import formatBytes from './formatBytes';

const CircularProgress = ({
  percentage,
  size = 200,
  strokeWidth = 12,
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
    <div className=" rounded-3xl shadow-lg p-8 max-w-md w-[90%] mx-auto" style={{
      background: `
      linear-gradient(to bottom right, #000000, #1e3a8a) padding-box,
      linear-gradient(var(--angle), #14b8a6, #0f766e, #14b8a6) border-box
    `,
      border: "4px solid transparent",
      animation: "rotate 8s linear infinite",
    }}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative inline-flex items-center justify-center mb-4">
          <svg
            className="transform -rotate-90"
            width={size}
            height={size}
          >
            <circle
              className="text-gray-200"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            <circle
              className="text-purple-600 transition-all duration-300 ease-in-out"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
          </svg>
          {/* Percentage text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-500 bg-clip-text text-transparent">{percentage}</span>
            <span className="text-2xl text-gray-200">%</span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-100">{percentage == 100 ? "Transfer Complete!" : title}</h2>

        <p className="text-green-400 text-lg">
          {percentage == 100 ? "Sent" : "Sending"} {fileCount} {fileCount === 1 ? 'file' : 'files'}
        </p>
        <p className="text-gray-100">
          {formatBytes(percentage == 100 ? totalSize : uploadedSize)} of {formatBytes(totalSize)} uploaded
        </p>

        {percentage == 100 && <button onClick={onClick}
          className="mt-4 hover:cursor-pointer font-bold w-[85%] py-3 px-4 border-2 rounded-full text-white bg-gradient-to-r from-emerald-600 to-green-500 hover:from-teal-700 hover:to-green-500 transition-colors duration-200 text-lg"
        >
          Upload more?
        </button>}
      </div>
    </div>
  );
};

export default CircularProgress;