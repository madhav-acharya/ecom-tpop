import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import '../styles/ReviewForm.css';
import { useCreateReviewMutation } from '../app/api/reviewAPI';
import { useGetCurrentUserQuery } from '../app/api/authAPI';
import { useParams } from 'react-router-dom';

const ReviewForm = () => {
    const productId = useParams().id;
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
    const { data: user, isSuccess, refetch } = useGetCurrentUserQuery();
    const [createReview] = useCreateReviewMutation();

    useEffect(() => {
        if (!user) {
            refetch();
        }
      if (isSuccess) {
        setUserId(user?.user?.id);
        console.log("user", user);
      }
    }, [isSuccess, user, refetch]);



  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!rating) {
      setError('Please select a rating');
      return;
    }
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please enter a review');
      return;
    }

    const review = {
        user: userId,
        name,
        rating,
        comment,
        productId,
    };
    console.log("revirew", review);
    createReview(review)
      .unwrap()
      .then(() => {
        setSubmitted(true);
        setError('');
        refetch();
      })
      .catch((err) => {
        setError('Failed to submit review. Please try again.');
        console.error('Error submitting review:', err);
      });
    setSubmitted(true);
    setError('');
  };
  
  if (submitted) {
    return (
      <div className="review-form-container">
        <div className="review-success">
          <h2>Thank You!</h2>
          <p>Your review has been submitted successfully.</p>
          <button 
            className="review-button" 
            onClick={() => {
              setSubmitted(false);
              setRating(0);
              setName('');
              setComment('');
            }}
          >
            Write Another Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <h2>Write a Review</h2>
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="rating-container">
          <p>Rate this product:</p>
          <div className="stars">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              
              return (
                <span
                  key={index}
                  className={`star ${starValue <= (hover || rating) ? 'active' : ''}`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                >
                  <Star 
                    fill={starValue <= (hover || rating) ? '#9b87f5' : 'none'} 
                    stroke={starValue <= (hover || rating) ? '#9b87f5' : '#8E9196'} 
                  />
                </span>
              );
            })}
          </div>
          {rating > 0 && <span className="rating-text">{getRatingText(rating)}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="comment">Your Review</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            rows="4"
          ></textarea>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="review-button">
          Submit Review
        </button>
      </form>
    </div>
  );
};

// Helper function to provide text feedback based on rating
function getRatingText(rating) {
  switch (rating) {
    case 1:
      return "Poor";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Very Good";
    case 5:
      return "Excellent";
    default:
      return "";
  }
}

export default ReviewForm;
