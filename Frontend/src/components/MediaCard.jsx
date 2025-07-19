import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MediaCard({ item, onWatchLater }) {
  const getBorderColor = (score) => {
    if (score >= 80) return 'border-green-500';
    if (score >= 40 || score == null) return 'border-yellow-500';
    return 'border-red-500';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  const getHighResImageUrl = (url) => {
    if (!url) return "/placeholder.svg";
    return url.replace(/_V1_.*?\.jpg/, '_V1_SY500_SX500_.jpg');
  };

  return (
    <Link 
      to={`/title/${item._id}`} 
      className="block transition-transform hover:scale-105"
    >
      <div className={`h-full rounded-xl border-4 bg-white ${getBorderColor(item.meta_score)} overflow-hidden`}>
        <div className="flex flex-col">
          {/* Image Section */}
          <div className="relative overflow-hidden rounded-t-lg" style={{ aspectRatio: '1 / 1' }}>
            <img
              src={getHighResImageUrl(item.pic_url)}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              style={{ willChange: 'transform' }}
            />
            <button 
              onClick={(e) => {
                e.preventDefault();
                onWatchLater(item);
              }}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <Clock className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content Section */}
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div>
              <h3 className="line-clamp-2 text-lg font-bold leading-tight h-12 overflow-hidden">
                {item.name}
              </h3>
              <span className="mt-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-medium">
                {item.genre.join(" • ")}
              </span>
            </div>
            
            <div className="mt-auto space-y-2">
              <div className="flex items-center justify-between">
                <div className={`rounded-md ${getScoreColor(item.score)} px-3 py-1 text-xl font-bold text-white`}>
                  {item.meta_score || 'NA'}
                </div>
                <div className="text-sm text-gray-600">
                  {item.votes} Reviews
                </div>
              </div>

              {/* Review Distribution Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div 
                  className={`h-full ${
                    item.positiveReviews + item.negativeReviews === 0
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                  style={{ 
                    width: `${
                      item.positiveReviews + item.negativeReviews === 0
                        ? "100%"
                        : `${(item.positiveReviews * 100) / (item.positiveReviews + item.negativeReviews)}%`
                    }`
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
