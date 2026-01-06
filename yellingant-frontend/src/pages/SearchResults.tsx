import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { request } from '../utils/api';
import { Search, ArrowLeft } from 'lucide-react';

interface Quiz {
  id: number;
  slug: string;
  title: string;
  dek?: string;
  description?: string;
  hero_image?: string;
  cover_image?: string;
  primary_colony?: string;
}

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await request(`/api/quiz/search?q=${encodeURIComponent(query)}`);
        setResults(response?.quizzes || []);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search quizzes..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-[#C85103] focus:border-transparent"
            />
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-32 h-24 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : query && results.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No quizzes found</h2>
            <p className="text-gray-500">Try different keywords or browse our categories</p>
          </div>
        ) : !query ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Search for quizzes</h2>
            <p className="text-gray-500">Enter a search term to find quizzes</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Found <span className="font-semibold">{results.length}</span> result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            
            <div className="space-y-4">
              {results.map((quiz) => (
                <Link
                  key={quiz.id}
                  to={`/quiz/${quiz.slug}`}
                  className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all overflow-hidden"
                >
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {(quiz.hero_image || quiz.cover_image) ? (
                        <img
                          src={quiz.hero_image || quiz.cover_image}
                          alt={quiz.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">{quiz.title.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
                        {quiz.title}
                      </h3>
                      {(quiz.dek || quiz.description) && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {quiz.dek || quiz.description}
                        </p>
                      )}
                      {quiz.primary_colony && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                          {quiz.primary_colony}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
