import { useState } from "react";
import { Star } from "lucide-react";

type Props = {
  reviews: google.maps.places.Review[];
};

export function ReviewList({ reviews }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="grid gap-4 overflow-y-scroll max-h-96">
      {reviews.map((review, i) => {
        const isExpanded = expandedIndex === i;

        return (
          <div key={i} className="rounded-2xl shadow p-4 bg-white m-2">
            <div className="flex items-start gap-1">
              {review.authorAttribution?.photoURI ? (
                <img
                  src={review.authorAttribution.photoURI}
                  alt="author"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-500">
                  {review.authorAttribution?.displayName[0]}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <a
                    href={review.authorAttribution?.uri!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-gray-800 hover:underline"
                  >
                    {review.authorAttribution?.displayName}
                  </a>
                  <span className="text-sm text-gray-500">
                    {review.relativePublishTimeDescription}
                  </span>
                </div>
                {review.rating && (
                  <div className="flex items-center mt-1 mb-2">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                    {Array.from({ length: 5 - review.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 text-gray-300" />
                    ))}
                  </div>
                )}

                <div
                  className={`text-sm text-gray-700 whitespace-pre-line transition-all duration-300 ${isExpanded
                      ? "max-h-48 overflow-y-auto pr-1"
                      : "line-clamp-3"
                    }`}
                >
                  {review.text}
                </div>

                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className="text-blue-500 text-xs mt-1 hover:underline"
                >
                  {isExpanded ? "접기" : "더보기"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
