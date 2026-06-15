import * as React from 'react';
import { cn } from './utils';

interface AgentAvatarProps {
  nom: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AgentAvatar({ nom, avatarUrl, size = 'md', className }: AgentAvatarProps) {
  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0]![0] || '') + (parts[1]![0] || '');
    }
    return name.slice(0, 2);
  };

  const getBackgroundColorClass = (name: string) => {
    // Generate a simple deterministic color class
    const colors = [
      'bg-[#0ea5e9] text-white', // blue
      'bg-[#f59e0b] text-stone-950', // gold
      'bg-emerald-600 text-white',
      'bg-indigo-600 text-white',
      'bg-rose-600 text-white',
      'bg-purple-600 text-white',
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length] || 'bg-stone-600 text-white';
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  };

  const initials = getInitials(nom).toUpperCase();
  const bgClass = getBackgroundColorClass(nom);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden font-bold border border-white/10 shadow-sm shrink-0',
        sizeClasses[size],
        avatarUrl ? 'bg-stone-100' : bgClass,
        className
      )}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={nom}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
