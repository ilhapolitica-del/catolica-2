import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ResultCard } from './components/ResultCard';
import { searchCatechism } from './services/geminiService';
import { CatechismResult } from './types';
import { Book, AlertCircle, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [results, setResults] = useState<CatechismResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    setLastQuery(query);
    setHasSearched(true);
    setResults([]); 

    try {
      const data = await searchCatechism(query);
      setResults(data);
    } catch (err: any) {
      console.error(err);
      let msg = "Ocorreu um erro desconhecido. Tente novamente.";
      
      if (err instanceof Error) {
        msg = err.message;
      }
      
      // Fallback genérico amigável se a mensagem for muito técnica
      if (msg.includes("fetch") || msg.includes("network")) {
        msg = "Erro de conexão. Verifique sua internet.";
      }
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#F5F5F0]">
      {/* Top decorative bar */}
      <div className="h-1 bg-gradient-to-r from-vatican-gold via-vatican-red to-vatican-gold sticky top-0 z-[60]"></div>

      {/* Sticky Search Header if searched */}
      <div className={`sticky top-1 z-50 transition-all duration-500 ${hasSearched ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none absolute w-full'}`}>
        <Header compact={true} />
        <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm">
          <div className="container mx-auto px-4">
             <SearchBar onSearch={handleSearch} loading={loading} compact={true} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className={`flex-grow flex flex-col ${hasSearched ? 'pt-8' : 'justify-center -mt-20'}`}>
        
        {/* Initial Hero View */}
        {!hasSearched && (
          <div className="w-full flex flex-col items-center px-4 animate-fade-in">
             <Header compact={false} />
             <SearchBar onSearch={handleSearch} loading={loading} compact={false} />
             
             <div className="mt-12 text-center">
               <p className="text-sm text-gray-400 mb-2 uppercase tracking-widest">Fonte de dados</p>
               <a 
                 href="https://www.catecismodaigreja.com.br" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 text-vatican-dark/60 hover:text-vatican-gold transition-colors font-serif italic"
               >
                 catecismodaigreja.com.br <ExternalLink className="w-3 h-3" />
               </a>
             </div>
          </div>
        )}

        {/* Results View */}
        {hasSearched && (
          <div className="container mx-auto px-4 max-w-3xl">
            {/* Status Bar */}
            <div className="mb-6 flex justify-between items-center border-b border-gray-200 pb-2">
              <h2 className="text-gray-500 font-serif italic">
                Resultados para: <span className="text-vatican-dark font-semibold not-italic">"{lastQuery}"</span>
              </h2>
              <span className="text-xs text-gray-400">{results.length} resultados</span>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-md flex flex-col items-center text-center gap-2 mb-8 shadow-sm">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <p className="font-semibold">Não foi possível realizar a busca</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && results.length === 0 && (
               <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="bg-white p-6 rounded shadow-sm border-l-4 border-gray-200 animate-pulse">
                     <div className="flex justify-between mb-4">
                       <div className="h-6 bg-gray-200 rounded w-16"></div>
                       <div className="h-6 bg-gray-200 rounded w-24"></div>
                     </div>
                     <div className="space-y-2">
                       <div className="h-4 bg-gray-200 rounded w-full"></div>
                       <div className="h-4 bg-gray-200 rounded w-full"></div>
                       <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                     </div>
                   </div>
                 ))}
               </div>
            )}

            {/* Empty State */}
            {!loading && !error && results.length === 0 && (
              <div className="text-center py-16 bg-white rounded shadow-sm border border-gray-100 mx-auto max-w-lg">
                <Book className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-500 mb-6 px-8">
                  Não encontramos parágrafos exatos para sua busca na base de dados. Tente termos mais gerais.
                </p>
                <button 
                  onClick={() => handleSearch("Credo")} 
                  className="text-vatican-red font-semibold hover:underline"
                >
                  Tentar buscar "Credo"
                </button>
              </div>
            )}

            {/* Results List */}
            <div className="space-y-6 pb-20">
              {results.map((result) => (
                <ResultCard key={result.number} result={result} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-vatican-dark text-vatican-cream py-8 mt-auto border-t-4 border-vatican-gold">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Book className="w-5 h-5 text-vatican-gold" />
            <span className="font-display font-bold">Catecismo AI</span>
          </div>
          <p className="text-sm opacity-60 max-w-md mx-auto mb-4">
            Busca inteligente baseada na edição típica do Catecismo da Igreja Católica.
          </p>
          <div className="text-xs opacity-40 border-t border-white/10 pt-4 mt-4 flex flex-col sm:flex-row justify-center gap-4">
             <span>Dados baseados em catecismodaigreja.com.br</span>
             <span>Powered by Google Gemini</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;