import React, { useEffect } from 'react';
import Heading from '../../SectionHeadings/Heading';
import axios from 'axios';

const CustomerReviews = () => {
  const [reviews, setReviews] = React.useState([]);
  
    useEffect(() => {
      axios.get("http://localhost:3000/review").then(response => {
        setReviews(response.data);
      }).catch(error => {
        console.error("Error fetching core values:", error);
      });
    }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <Heading 
        heading="What Our Customers Are Saying"
        desc="Real reviews from happy shoppers. See why people love our products!"
        />   
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {reviews.map((review) => (
          <div 
            key={review.id}
            className="group border-2 border-gray-100 rounded-2xl p-8 hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 ease-out hover:shadow-lg bg-white"
          >
            {/* Customer Avatar and Info */}
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <span className="text-gray-700 font-semibold text-sm">
                  {review.avatar}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">
                  {review.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {review.date}
                </p>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-gray-700 leading-relaxed mb-6 text-sm">
              "{review.review}"
            </p>

            {/* Verification Badge */}
            <div className="border-t border-gray-100 pt-4">
              {review.verified && (
                <span className="text-xs text-green-600 font-medium">
                  ✓ Verified Purchase
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
     
    </section>
  );
};

export default CustomerReviews;
