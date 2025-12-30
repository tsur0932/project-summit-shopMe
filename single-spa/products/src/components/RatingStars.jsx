import React from "react";


export default function RatingStars({ rating }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;


  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={i} className="star filled">
        ★
      </span>
    );
  }


  if (hasHalfStar) {
    stars.push(
      <span key="half" className="star half">
        ★
      </span>
    );
  }


  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span key={`empty-${i}`} className="star">
        ☆
      </span>
    );
  }


  return <>{stars}</>;
}






