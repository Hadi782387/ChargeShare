import React from 'react';
import { ReachabilityStatus } from '../../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Ban } from 'lucide-react';

interface AvailabilityBadgeProps {
  status?: ReachabilityStatus;
  availableNow?: boolean;
  className?: string;
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  status = 'reachable',
  availableNow = true,
  className = '',
}) => {
  if (!availableNow) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-surface-card text-ink-muted border border-surface-border ${className}`}
      >
        <span>Offline</span>
      </span>
    );
  }

  switch (status) {
    case 'reachable':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary-subtle text-primary border border-primary/30 shadow-sm ${className}`}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>Reachable</span>
        </span>
      );
    case 'tight':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-warning-subtle text-warning border border-warning/30 ${className}`}
        >
          <AlertTriangle className="w-3 h-3" />
          <span>Tight Range</span>
        </span>
      );
    case 'too_far':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-surface-card text-ink-muted border border-surface-border ${className}`}
        >
          <AlertCircle className="w-3 h-3" />
          <span>Too Far</span>
        </span>
      );
    case 'not_compatible':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-surface-card text-ink-subtle border border-surface-border opacity-70 ${className}`}
        >
          <Ban className="w-3 h-3" />
          <span>Not Compatible</span>
        </span>
      );
    default:
      return null;
  }
};
