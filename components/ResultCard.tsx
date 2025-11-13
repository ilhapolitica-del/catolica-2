import React from 'react';
import { CatechismResult } from '../types';
import { Share2, Copy, ExternalLink, BookOpen } from 'lucide-react';

interface ResultCardProps {
  result: CatechismResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`Catecismo §${result.number}: "${result.text}"`);
  };

  // Construct URL to the specific paragraph on the requested site
  const sourceUrl = `https://www.catecismodaigreja.com.br/paragrafo/${result.number}`;

  return (
    <div className="group relative bg-white p-6 rounded-sm shadow-sm hover:shadow-md border-l-4 border-vatican-gold transition-all duration-300 ease-in-out mb-6">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-vatican-red text-xl">
            § {result.number}
          </span>
          <span className="px-2 py-1 rounded bg-vatican-cream text-xs font-semibold text-vatican-gold uppercase tracking-wide">
            {result.topic}
          </span>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
           <button 
             onClick={copyToClipboard}
             className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-vatican-dark transition-colors" 
             title="Copiar texto"
           >
             <Copy className="w-4 h-4" />
           </button>
           <a 
             href={sourceUrl}
             target="_blank"
             rel="noopener noreferrer"
             className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-vatican-gold transition-colors" 
             title="Ler no site oficial"
           >
             <ExternalLink className="w-4 h-4" />
           </a>
        </div>
      </div>
      
      <div className="font-serif text-gray-800 leading-relaxed text-lg text-justify">
        {result.text}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        {result.reference ? (
          <p className="text-xs text-gray-400 font-mono">
            Ref: {result.reference}
          </p>
        ) : <span></span>}
        
        <a 
          href={sourceUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs flex items-center gap-1 text-vatican-gold font-bold hover:underline opacity-80 hover:opacity-100"
        >
          Ler contexto <BookOpen className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};