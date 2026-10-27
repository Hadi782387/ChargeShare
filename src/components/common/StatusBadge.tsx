import React from 'react';
import { RequestStatus } from '../../types';
import { Clock, CheckCircle2, Navigation, Zap, Award, XCircle } from 'lucide-react';

export const StatusBadge: React.FC<{ status: RequestStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  switch (status) {
    case 'requested':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 ${className}`}
        >
          <Clock className="w-3.5 h-3.5 animate-spin" />
          <span>Requested</span>
        </span>
      );
    case 'accepted':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-primary border border-indigo-200 shadow-sm ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
          <span>Accepted</span>
        </span>
      );
    case 'on_the_way':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 ${className}`}
        >
          <Navigation className="w-3.5 h-3.5 animate-pulse text-sky-600" />
          <span>On The Way</span>
        </span>
      );
    case 'charging':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 animate-pulse ${className}`}
        >
          <Zap className="w-3.5 h-3.5 fill-current text-emerald-600" />
          <span>Charging</span>
        </span>
      );
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-400 ${className}`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-700" />
          <span>Completed</span>
        </span>
      );
    case 'declined':
    case 'cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span className="capitalize">{status}</span>
        </span>
      );
    default:
      return null;
  }
};
