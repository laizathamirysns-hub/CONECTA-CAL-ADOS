/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  color?: 'light' | 'dark' | 'gold';
}

export function Logo({ className = '', variant = 'full', color = 'light' }: LogoProps) {
  const colors = {
    light: '#FFFFFF',
    dark: '#0A0A0A',
    gold: '#D4AF37',
  };

  const activeColor = colors[color];

  const icon = (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      {/* Stylized Sole / Connection Path */}
      <motion.path
        d="M30 20C30 20 20 30 20 50C20 70 30 80 50 80C70 80 80 70 80 50C80 30 70 20 50 20"
        stroke={activeColor}
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Connection Nodes */}
      <motion.circle
        cx="50" cy="20" r="4"
        fill={activeColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      />
      <motion.circle
        cx="80" cy="50" r="4"
        fill={activeColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7 }}
      />
      <motion.circle
        cx="50" cy="80" r="4"
        fill={activeColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.9 }}
      />
      <motion.circle
        cx="20" cy="50" r="4"
        fill={activeColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.1 }}
      />

      {/* Internal Connection Lines */}
      <motion.path
        d="M50 20L80 50M80 50L50 80M50 80L20 50M20 50L50 20"
        stroke={activeColor}
        strokeWidth="1"
        strokeDasharray="4 4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.3 }}
      />
      
      {/* Central Core */}
      <motion.path
        d="M40 50H60M50 40V60"
        stroke={activeColor}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5 }}
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`aspect-square ${className}`}>
        {icon}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-10 w-10 shrink-0">
        {icon}
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-[0.2em] uppercase" style={{ color: activeColor }}>
          Conecta
        </span>
        <span className="text-[10px] font-medium tracking-[0.5em] uppercase opacity-60" style={{ color: activeColor }}>
          Calçados
        </span>
      </div>
    </div>
  );
}
