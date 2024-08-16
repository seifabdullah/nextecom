"use client";

import { useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useSearchParams } from "next/navigation";
import { useProduct } from "@/context/product";

export default function ProductsSearchPage() {
  // Context
  const {
    setProductSearchQuery,
    productSearchResults,
    setProductSearchResults,
  } = useProduct();

  // Get search query parameters from URL
  const productSearchParams = useSearchParams();
  const query = productSearchParams.get("productSearchQuery");

  // Fetch results on page load based on query
  useEffect(() => {
    if (query) {
      setProductSearchQuery(query);
      fetchProductResultsOnLoad(query);
    }
  }, [query]);

  // Fetch product results from API
  const fetchProductResultsOnLoad = async (searchQuery) => {
    try {
      const response = await fetch(
        `${process.env.API}/search/products?productSearchQuery=${searchQuery}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setProductSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Search Results</h2>
      <p className="text-muted mb-4">
        {productSearchResults?.length || 0} result
        {productSearchResults?.length !== 1 ? "s" : ""}
      </p>
      {productSearchResults?.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {productSearchResults.map((product) => (
            <div key={product._id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No results found.</p>
      )}
    </div>
  );
}
