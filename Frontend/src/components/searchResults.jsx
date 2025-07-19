"use client"

import { useState, useEffect } from "react"
import MediaCard from "./MediaCard"
import axiosInstance from "../utils/axiosConfig"

export default function SearchResultsList({ searchTerm }) {
  const [results, setResults] = useState([])

  const fetchSearchResults = async () => {
    try {
      const res = await axiosInstance.get(`/user/searchMovie?query=${searchTerm}`)
      console.log(res.data)
      setResults(res.data)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    console.log(searchTerm)
    if (searchTerm) fetchSearchResults()
  }, [searchTerm])

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold mb-8">Search Results</h2>
      
      <div className="grid grid-cols-4 gap-4 overflow-y-auto max-h-[70vh]">
        {results.length > 0 ? (
          results.map((item) => (
            <div key={item.id} className="py-4">
              <MediaCard item={item} />
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-4">No results found.</p>
        )}
      </div>
    </div>
  )
}
