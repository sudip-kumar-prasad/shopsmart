import React from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id } = useParams();
  return (
    <div className="product-page">
      <section className="container section">
        <h1>Product Details</h1>
        <p>Details for product with ID: {id}</p>
      </section>
    </div>
  );
};

export default ProductPage;
