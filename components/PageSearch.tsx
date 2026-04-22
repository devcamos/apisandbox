"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Clock3, Command, Search } from "lucide-react";
import {
  findSearchResultByHref,
  getFeaturedResults,
  searchPages,
  type SearchResult,
} from "@/lib/page-search-data";

const RECENT_LIMIT = 4;
const featuredResults = getFeaturedResults();

export function PageSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentResults, setRecentResults] = useState<SearchResult[]>([]);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    setResults(searchPages(query));
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const shortcutPressed = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";

      if (shortcutPressed) {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
        inputRef.current?.select();
        return;
      }

      if (!isOpen) {
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const list = results.length > 0 ? results : query ? [] : featuredResults;
            const maxIndex = list.length - 1;
            if (maxIndex < 0) {
              return -1;
            }
            return prev < maxIndex ? prev + 1 : maxIndex;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter": {
          const activeResults = results.length > 0 ? results : query ? [] : featuredResults;
          if (selectedIndex < 0 || selectedIndex >= activeResults.length) {
            return;
          }
          e.preventDefault();
          handleSelect(activeResults[selectedIndex]);
          break;
        }
        case "Escape":
          setIsOpen(false);
          setQuery("");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, query, results, selectedIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setRecentResults((current) => {
      const nextRecent = [result.href, ...current.map((item) => item.href).filter((href) => href !== result.href)]
        .slice(0, RECENT_LIMIT);
      return nextRecent
        .map((href) => findSearchResultByHref(href))
        .filter((item): item is SearchResult => Boolean(item));
    });
    setQuery("");
    setIsOpen(false);
    router.push(result.href);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Main: "bg-blue-100 text-blue-800",
      Account: "bg-slate-200 text-slate-700",
      "Phase 0": "bg-green-100 text-green-800",
      "Phase 1": "bg-purple-100 text-purple-800",
      "Phase 2": "bg-yellow-100 text-yellow-800",
      "Phase 3": "bg-red-100 text-red-800",
      "Phase 4": "bg-indigo-100 text-indigo-800",
      Cloud: "bg-cyan-100 text-cyan-800",
      AI: "bg-pink-100 text-pink-800",
      Databases: "bg-orange-100 text-orange-800",
      Security: "bg-emerald-100 text-emerald-800",
      Docs: "bg-teal-100 text-teal-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const openResults = query ? results : featuredResults;

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          aria-label="Search pages"
          placeholder="Search pages, phases, topics"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full min-w-0 md:w-80 pl-10 pr-16 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border border-slate-600 bg-slate-900 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-400 md:inline-flex">
          <Command className="h-3 w-3" />
          K
        </span>
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {openResults.length > 0 ? (
            <div className="py-2">
              {!query && recentResults.length > 0 && (
                <div className="px-4 pb-2">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    Recent
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentResults.map((result) => (
                      <button
                        key={`recent-${result.href}`}
                        onClick={() => handleSelect(result)}
                        className="rounded-full border border-slate-600 px-3 py-1 text-xs text-gray-300 transition-colors hover:border-blue-400 hover:text-white"
                      >
                        {result.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!query && (
                <div className="px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Featured pages
                </div>
              )}

              {openResults.map((result, index) => (
                <button
                  key={result.href}
                  onClick={() => handleSelect(result)}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-700 flex items-start space-x-3 transition-colors ${
                    index === selectedIndex ? 'bg-slate-700' : ''
                  }`}
                >
                  <result.icon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center space-x-2">
                      <span className="text-white font-medium truncate">{result.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(result.category)}`}>
                        {result.category}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">{result.description}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <ArrowRight className="w-3 h-3 mr-1" />
                      {result.href}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="px-4 py-8 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try searching for phases, demos, cloud topics, or docs</p>
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-medium">Quick Navigation</p>
              <p className="text-sm mt-1">Use Cmd/Ctrl+K to jump anywhere in the app</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
