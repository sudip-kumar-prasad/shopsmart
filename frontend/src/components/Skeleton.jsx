import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, borderRadius, className = '' }) => {
  const style = {
    width: width || '100%',
    height: height || '1rem',
    borderRadius: borderRadius || '0.5rem',
  };

  return <div className={`skeleton-shimmer ${className}`} style={style}></div>;
};

export const ProductSkeleton = () => (
  <div className="product-skeleton-card">
    <Skeleton height="250px" borderRadius="1rem" className="mb-4" />
    <Skeleton width="40%" height="0.8rem" className="mb-2" />
    <Skeleton width="80%" height="1.2rem" className="mb-2" />
    <Skeleton width="30%" height="1rem" />
  </div>
);

export default Skeleton;
