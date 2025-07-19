import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, Clock, Flag } from "lucide-react";
import ReviewForm from "../components/ReviewForm";
import MediaCard from "../components/MediaCard"; // Assuming you have a MediaCard component
import axiosInstance from "../utils/axiosConfig";

export default function MediaDetail({ onWatchLater, user }) {
  const [media, setMedia] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { id } = useParams();
  const getHighResImageUrl = (url) => {
    if (!url) return "/placeholder.svg";
    return url.replace(/_V1_.*?\.jpg/, '_V1_SY500_SX500_.jpg');
  };
  async function fetchMediaDetail(id) {
    try{
      const response = await axiosInstance.get(`/user/getMovieDetails/${id}`);
      return response.data
    }
    catch(e)
   {
      console.log(e)
      throw new Error('Failed to fetch media details');
    }
    
  }
  
  async function fetchMediaReviews(id) {
    try{
      const response = await axiosInstance.get(`/user/getMovieReviews/${id}`);
      console.log(response.data)
     return response.data
      
    }
    catch(e)
   {
      console.log(e)
      throw new Error('Failed to fetch media reviews');
    }
  }
  
 
  // Fetch data on component mount or when `id` changes
  useEffect(() => {
    async function loadData() {
      try {
        const [mediaData, reviewsData] = await Promise.all([
          fetchMediaDetail(id),
          fetchMediaReviews(id),
          
        ]);
        setMedia(mediaData);
        setReviews(reviewsData);
       
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);
  const handleEditReview = (review) => {
    setSelectedReview(review);
  };
  
  // Function to handle delete review
  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm("Are you sure you want to delete this review?");
    if (!confirmed) return;
  
    try {
      // Assuming you're making an API call to delete the review from the backend
      await axiosInstance.delete(`/user/review/${reviewId}`, {
        method: "DELETE",
      });
  
      // Update state to remove the deleted review
      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };
  // Handle adding a new review
  const handleAddReview = async (reviewData) => {
    
    console.log(reviewData)
    try{
      const res = await axiosInstance.post("/user/review",{movie_id:media._id,text:reviewData.content});
      console.log(res)
      window.location.reload()
    }
    catch(e){
      console.log(e);
    }
    
    setShowReviewForm(false);
  };

  // Filter reviews based on the active tab
  const filteredReviews = (reviews || []).filter((review) => {
    if (activeTab === "all") return true;
    return review.type === activeTab;
  });

  // Calculate review statistics
  const reviewStats = {
    total: reviews?reviews.length:0,
    positive: (reviews||[]).filter((review) => review.type === "positive").length,
    mixed: (reviews||[]).filter((review) => review.type === "mixed").length,
    negative: (reviews||[]).filter((review) => review.type === "negative").length,
  };

  // Loading state
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Error state
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  // Render the component with fetched data
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center">
          <ChevronLeft className="mr-2 h-6 w-6" />
          <h1 className="text-xl font-bold">{media?.name || "Media Title"}</h1>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          {/* Video Player */}
          <div className="aspect-video bg-gray-200 *:">
            <img controls className="h-full w-auto mx-auto" src={getHighResImageUrl(media?.pic_url) || "/placeholder.svg?height=400&width=700"}/>
              
            
          </div>

          {/* Title and Rating */}
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold">{media?.name || "Media Title"}</h2>
              <div className="text-xl">{media?.genre.join(" • ") || "Season 1"}</div>
              <div className="mt-2 text-sm text-gray-600">
                Season Premiere: {media?.release_date || "FEB 16, 2025"}
              </div>
            </div>

            {/* Metascore */}
            <div className="flex items-center space-x-4">
              <div className="rounded bg-green-500 px-4 py-2 text-2xl font-bold text-white">
                {media?.meta_score||"NA"}
              </div>
              <div>
                {(media?.meta_score > 75)?<div className="font-medium">Generally Favorable</div>:<div className="font-medium">Can't say much</div>}
                
                
              </div>
            </div>

            {/* User Score */}
            <div className="flex items-center space-x-4">
            {media?.average_rating>3?<div className="rounded-full bg-green-500 p-4 text-2xl font-bold text-white">
                {media?.average_rating }
              </div>:<div className="rounded-full bg-yellow-500 p-4 text-2xl font-bold text-white">
                {Math.trunc(media?.average_rating * 10) / 10 }
              </div>}
              
              <div>
                {media?.average_rating>3?<div className="font-medium">Generally Favorable</div>:<div className="font-medium">Depends on you</div>}
                <div className="text-sm text-gray-600">Based on {reviewStats.total} User Ratings</div>
              </div>
            </div>

            <WatchlistButton movieId={id}/>
            
              
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold">Summary</h2>
          <p className="text-gray-700">{media?.description || "No summary available."}</p>
          <div className="flex gap-2">
            {media?.genre?.map((genre, index) => (
              <span key={index} className="rounded-full bg-gray-200 px-3 py-1 text-sm">
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">User Reviews</h2>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div className="flex items-center space-x-8">
                <div>
                  <div className="text-sm font-medium text-gray-600">Total Reviews</div>
                  <div className="text-2xl font-bold">{reviewStats.total}</div>
                </div>
                <div className="h-12 w-[300px]">
                  <div className="flex h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="bg-green-500"
                      style={{ width: `${(reviewStats.positive / reviewStats.total) * 100}%` }}
                    />
                    <div
                      className="bg-yellow-500"
                      style={{ width: `${(reviewStats.mixed / reviewStats.total) * 100}%` }}
                    />
                    <div
                      className="bg-red-500"
                      style={{ width: `${(reviewStats.negative / reviewStats.total) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>{Math.round((reviewStats.positive / reviewStats.total) * 100)}% Positive</span>
                    <span>{Math.round((reviewStats.mixed / reviewStats.total) * 100)}% Mixed</span>
                    <span>{Math.round((reviewStats.negative / reviewStats.total) * 100)}% Negative</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowReviewForm(true)}
                className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Add My Review
              </button>
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-6">
              <ReviewForm onSubmit={handleAddReview} onCancel={() => setShowReviewForm(false)} />
            </div>
          )}

          {/* Review Tabs */}
          <div className="mb-6 flex space-x-4 border-b">
            {[
              { id: "all", label: "All Reviews" },
              { id: "positive", label: "Positive Reviews" },
              { id: "mixed", label: "Mixed Reviews" },
              { id: "negative", label: "Negative Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-4 py-2 ${
                  activeTab === tab.id ? "border-black font-medium" : "border-transparent text-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Review List */}
          <div className="space-y-6">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div key={review.id} className="rounded-lg bg-gray-50">
                  <div className="flex items-start space-x-4 hover:bg-gray-200 transition duration-75 p-4 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{review.author}</h3>
                          <div className="text-sm text-gray-600">{review.date}</div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`h-5 w-5 ${
                                index < review.score // ✅ Corrected star logic
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="mt-2 text-gray-700">
                        {review.content.length > 200 ? (
                          <>
                            {review.content.slice(0, 200)}...
                            <button
                              onClick={() => setSelectedReview(review)}
                              className="ml-2 text-blue-500 hover:underline"
                            >
                              Read More
                            </button>
                          </>
                        ) : (
                          review.content
                        )}
                      </p>

                      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                        {review.canEdit && (
                          <div className="flex space-x-2">
                           
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reviews till now.
              </div>
            )}
          </div>
        </div>

       
        
      </div>

      {/* Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedReview.authorImage || "/placeholder.svg"}
                  alt={selectedReview.author}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{selectedReview.author}</h3>
                  <div className="text-sm text-gray-600">{selectedReview.date}</div>
                </div>
              </div>
              <button onClick={() => setSelectedReview(null)} className="rounded-full p-1 hover:bg-gray-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-700">{selectedReview.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const WatchlistButton = ({ movieId }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);


  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const response = await axiosInstance.get(`/user/getWatchlist`);
        const watchlist = response.data; 
        console.log(watchlist)
        setIsInWatchlist(watchlist?.some(movie=>movie._id == movieId));
      } catch (error) {
        console.error("Error checking watchlist:", error);
      }
    };

    checkWatchlist();
  }, [ movieId]);

  // Function to add to watchlist
  const addToWatchlist = async () => {
    try {
      await axiosInstance.post(`/user/addToWatchlist`, { movie_id:movieId });
      setIsInWatchlist(true);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  // Function to remove from watchlist
  const removeFromWatchlist = async () => {
    try {
      await axiosInstance.post(`/user/removeFromWatchlist`, { movie_id:movieId });
      setIsInWatchlist(false);
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  };

  return (
    <button
      onClick={isInWatchlist ? removeFromWatchlist : addToWatchlist}
      className={`px-4 py-2 rounded-md text-white ${
        isInWatchlist ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
    </button>
  );
};