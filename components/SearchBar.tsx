import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading, compact }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto transition-all duration-500 ${compact ? 'mt-0' : 'mt-8'}`}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none`}>
          {loading ? (
            <Loader2 className="w-5 h-5 text-vatican-gold animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-vatican-gold transition-colors" />
          )}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="O que o Catecismo diz sobre..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-full shadow-sm text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vatican-gold/50 focus:border-vatican-gold transition-all"
          disabled={loading}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-vatican-red text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>
      
      {!compact && (
        <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm text-gray-500">
          <span>Sugestões:</span>
          <button onClick={() => { setInput("Eucaristia"); onSearch("Eucaristia"); }} className="hover:text-vatican-red underline decoration-vatican-gold/50">Eucaristia</button>
          <button onClick={() => { setInput("Pecado Mortal"); onSearch("Pecado Mortal"); }} className="hover:text-vatican-red underline decoration-vatican-gold/50">Pecado Mortal</button>
          <button onClick={() => { setInput("Oração do Pai Nosso"); onSearch("Oração do Pai Nosso"); }} className="hover:text-vatican-red underline decoration-vatican-gold/50">Pai Nosso</button>
        </div>
      )}
    </div>
  );
};