"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCategory } from "@/context/category";

export default function Categories() {
  // Context
  const { categories, fetchCategories, setUpdatingCategory } = useCategory();
  
  // Loading state
  const [loading, setLoading] = useState(true);
  
  // Error state
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        await fetchCategories();
      } catch (err) {
        console.error(err);
        setError("Failed to fetch categories.");
        toast.error("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [fetchCategories]);

  if (loading) {
    return <div className="text-center">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          {categories.length === 0 ? (
            <div className="text-center">No categories available</div>
          ) : (
            categories.map((c) => (
              <button
                key={c._id} // Ensure _id is unique
                className="btn btn-primary m-2" // Added some styling for better visibility
                onClick={() => setUpdatingCategory(c)}
              >
                {c.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
