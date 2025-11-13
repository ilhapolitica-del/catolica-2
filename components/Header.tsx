import React from 'react';
import { BookOpen, Search } from 'lucide-react';

interface HeaderProps {
  compact?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ compact }) => {
  return (
    <header className={`w-full transition-all duration-500 ${compact ? 'py-4 bg-white shadow-sm border-b border-vatican-gold/20' : 'py-12 bg-transparent'}`}>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <div className={`flex items-center justify-center gap-3 text-vatican-red mb-2 transition-transform duration-500 ${compact ? 'scale-90' : 'scale-100'}`}>
          <BookOpen className="w-8 h-8" />
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-wide text-vatican-dark">
            CATECISMO
            <span className="text-vatican-gold ml-2">DA IGREJA</span>
          </h1>
        </div>
        {!compact && (
          <p className="font-serif text-vatican-dark/70 italic mt-2 text-lg max-w-xl">
            "A fé procura compreender"
          </p>
        )}
      </div>
    </header>
  );
};