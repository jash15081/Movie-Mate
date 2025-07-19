"use client"

import { useEffect, useState } from "react"
import MediaCard from "../components/MediaCard"
import axiosInstance from "../utils/axiosConfig"

export default function WatchList() {
  
  const [watchList, setWatchList] = useState([])

  const fetchWatchList = async()=>{
    try{
      const res = await axiosInstance.get("/user/getWatchList");
      setWatchList(res.data);
      console.log(res)
    }
    catch(e){
      console.log(e);
    }
  }
  const removeFromWatchList = (item) => {
    setWatchList(watchList.filter((i) => i.id !== item.id))
  }
  useEffect(()=>{
    fetchWatchList()
  },[])

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="mb-8 text-3xl font-bold">Watch Later</h1>

      {watchList?.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <p className="text-lg text-gray-600">Your watch list is empty</p>
          <p className="mt-2 text-gray-500">Add items to your watch list by clicking the clock icon on any title</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {watchList?.map((item) => (
            <MediaCard key={item.id} item={item} onWatchLater={() => removeFromWatchList(item)} />
          ))}
        </div>
      )}
    </div>
  )
}

