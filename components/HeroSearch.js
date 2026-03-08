"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Match Mapbox feature to our city or state and return path or null.
 */
function matchToPath(feature, states, cities) {
  const placeName = feature.place_name || "";
  const context = feature.context || [];
  const placeText = (feature.text || "").trim();
  const region = context.find((c) => c.id?.startsWith("region."));
  const stateName = region?.text?.trim() || "";

  if (!stateName && !placeText) return null;

  // Try exact city + state match first
  if (cities?.length && stateName && placeText) {
    const normalizedState = stateName.toLowerCase();
    const normalizedPlace = placeText.toLowerCase();
    const city = cities.find(
      (c) =>
        c.stateName?.toLowerCase() === normalizedState &&
        (c.cityName?.toLowerCase() === normalizedPlace ||
          c.cityName?.toLowerCase().startsWith(normalizedPlace) ||
          normalizedPlace.startsWith(c.cityName?.toLowerCase()))
    );
    if (city?.stateSlug && city?.citySlug)
      return `/${city.stateSlug}/${city.citySlug}`;
  }

  // Fall back to state-only match
  const state = states?.find(
    (s) =>
      s["State Name"]?.toLowerCase() === stateName.toLowerCase() ||
      s["State Name"]?.toLowerCase().includes(stateName.toLowerCase())
  );
  if (state?.Slug) return `/${state.Slug}`;

  return null;
}

/**
 * Zillow-style hero with Mapbox address search.
 */
export default function HeroSearch({ states, cities }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const debounceRef = useRef(null);
  const listRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (q) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/geocode?q=${encodeURIComponent(q)}`
      );
      const data = await res.json();

      if (!res.ok) {
        console.warn("Geocode error:", data.error || res.statusText);
        setSuggestions([]);
        return;
      }
      const features = Array.isArray(data.features) ? data.features : [];
      setSuggestions(features);
      setSelectedIndex(-1);
    } catch (err) {
      console.warn("Geocode request failed:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query.trim());
      setIsOpen(true);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);

  const handleSelect = (feature) => {
    const path = matchToPath(feature, states, cities);
    setQuery(feature.place_name || "");
    setSuggestions([]);
    setIsOpen(false);
    if (path) {
      router.push(path);
    } else {
      document.getElementById("choose-state")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      document.getElementById("choose-state")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (suggestions.length > 0 && selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelect(suggestions[selectedIndex]);
      return;
    }
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
      return;
    }
    const state = states?.find(
      (s) =>
        s["State Name"]?.toLowerCase().includes(q.toLowerCase()) ||
        s.Slug?.toLowerCase().includes(q.replace(/\s+/g, "-"))
    );
    if (state?.Slug) {
      router.push(`/${state.Slug}`);
      return;
    }
    document.getElementById("choose-state")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      listRef.current.children[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <section className="relative min-h-[32rem] sm:min-h-[36rem] flex flex-col justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 sm:px-6 text-center">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
          Find first-time homebuyer programs near you
        </h1>
        <p className="mt-3 text-lg text-white/95 drop-shadow sm:text-xl max-w-2xl mx-auto">
          Down payment assistance, grants, and closing cost help—by city. See
          every program in one place.
        </p>

        <form
          ref={containerRef}
          onSubmit={handleSubmit}
          className="mt-8 mx-auto max-w-xl relative"
          role="search"
        >
          <div className="flex flex-col sm:flex-row gap-2 rounded-xl overflow-hidden shadow-xl bg-white/95 backdrop-blur-sm">
            <label htmlFor="hero-search" className="sr-only">
              City, state, or ZIP
            </label>
            <div className="relative flex-1 min-w-0">
              <input
                id="hero-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                placeholder="Enter an address or city"
                className="w-full px-4 py-3.5 sm:py-4 text-gray-900 placeholder-gray-500 border-0 text-base focus:outline-none rounded-t-xl sm:rounded-tr-none sm:rounded-l-xl"
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={isOpen && suggestions.length > 0}
                aria-controls="hero-search-list"
                aria-activedescendant={
                  selectedIndex >= 0 ? `hero-suggestion-${selectedIndex}` : undefined
                }
              />
              {loading && (
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
                  aria-hidden
                />
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-colors shrink-0"
            >
              Find programs
            </button>
          </div>

          {isOpen && suggestions.length > 0 && (
            <ul
              id="hero-search-list"
              ref={listRef}
              className="absolute left-0 right-0 top-full mt-1 py-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-auto z-20"
              role="listbox"
            >
              {suggestions.map((feature, i) => (
                <li
                  key={feature.id}
                  id={`hero-suggestion-${i}`}
                  role="option"
                  aria-selected={i === selectedIndex}
                  className={`px-4 py-2.5 cursor-pointer text-left text-sm ${
                    i === selectedIndex
                      ? "bg-blue-50 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(feature);
                  }}
                >
                  {feature.place_name}
                </li>
              ))}
            </ul>
          )}
        </form>

        <p className="mt-4 text-sm text-white/90">
          Search by address or city, or choose your state below.
        </p>
      </div>
    </section>
  );
}
