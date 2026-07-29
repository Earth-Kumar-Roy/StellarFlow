import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface CountdownTimerProps {
  deadline: number; // Unix timestamp in seconds
  onExpire?: () => void;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  deadline,
  onExpire,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTime = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire();
      } else {
        const days = Math.floor(diff / (3600 * 24));
        const hours = Math.floor((diff % (3600 * 24)) / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = Math.floor(diff % 60);
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [deadline, onExpire]);

  return (
    <div className={`bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      
      {/* Icon and Description */}
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-xl border ${
          timeLeft.isExpired 
            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
        }`}>
          {timeLeft.isExpired ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <Clock className="w-5 h-5 animate-pulse" />
          )}
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Escrow Expiration Deadline
          </p>
          <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
            {timeLeft.isExpired
              ? 'Deadline Exceeded — Client refund eligible'
              : 'Time remaining until refund window opens'}
          </p>
        </div>
      </div>

      {/* Countdown Digits */}
      <div className="flex items-center space-x-2 font-mono">
        {timeLeft.isExpired ? (
          <span className="text-rose-400 font-bold text-xs sm:text-sm bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20 tracking-wider">
            EXPIRED
          </span>
        ) : (
          <div className="flex items-center space-x-1.5 text-indigo-300">
            <div className="bg-slate-900/90 border border-slate-700/60 px-3 py-1.5 rounded-xl text-center min-w-[48px]">
              <span className="text-base sm:text-lg font-bold block">{timeLeft.days}</span>
              <span className="text-[9px] uppercase text-slate-400 block -mt-1 font-sans">Days</span>
            </div>
            <span className="text-slate-500 font-bold">:</span>
            <div className="bg-slate-900/90 border border-slate-700/60 px-3 py-1.5 rounded-xl text-center min-w-[48px]">
              <span className="text-base sm:text-lg font-bold block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase text-slate-400 block -mt-1 font-sans">Hours</span>
            </div>
            <span className="text-slate-500 font-bold">:</span>
            <div className="bg-slate-900/90 border border-slate-700/60 px-3 py-1.5 rounded-xl text-center min-w-[48px]">
              <span className="text-base sm:text-lg font-bold block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase text-slate-400 block -mt-1 font-sans">Mins</span>
            </div>
            <span className="text-slate-500 font-bold">:</span>
            <div className="bg-slate-900/90 border border-slate-700/60 px-3 py-1.5 rounded-xl text-center min-w-[48px]">
              <span className="text-base sm:text-lg font-bold block">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase text-slate-400 block -mt-1 font-sans">Secs</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};