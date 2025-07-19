"use client";

import { useState, useEffect } from "react";
import MediaCard from "./MediaCard";
import axiosInstance from "../utils/axiosConfig";

export default function Recommanded({ searchTerm }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendedMovies = async () => {
    try {
      const res = await axiosInstance.get(`/user/getRecommendations`);
      setResults(Array.isArray(res.data.recommended_movies) ? res.data.recommended_movies : []);
    } catch (e) {
      console.log("Error fetching recommendations:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedMovies();
  }, []);

  return (
    <div className="py-8 px-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Recommended Movies</h2>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-600 text-lg">Loading recommendations...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-4 gap-6 overflow-y-auto max-h-[70vh] p-4 bg-white shadow-lg rounded-xl">
          {results.map((item) => (
            <div key={item.id} className="py-4">
              <MediaCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center mt-6">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg max-w-lg">
            <p className="font-semibold text-lg">No recommendations found.</p>
            <p className="text-sm">Please rate at least one movie to get personalized recommendations.</p>
          </div>
        </div>
      )}
    </div>
  );
}
