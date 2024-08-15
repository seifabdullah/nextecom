"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { priceRanges } from "@/utils/filterData";
import Link from "next/link";
import Stars from "./Stars";
import { useCategory } from "@/context/category";
import { useTag } from "@/context/tag";
import { FaTimes } from "react-icons/fa";
import { useProduct } from "@/context/product";

export default function ProductFilter({ searchParams }) {
  const router = useRouter();
  const pathname = "/shop";
  const { minPrice, maxPrice, tag, brand, category, ratings } =
    searchParams || {};

  const activeButton =
    "btn btn-primary btn-raised mx-1 rounded-pill shadow-sm d-flex align-items-center justify-content-center";
  const button =
    "btn btn-outline-secondary border-20 mx-1 rounded-pill shadow-sm d-flex align-items-center justify-content-center";
  const clearButton =
    "btn btn-outline-danger btn-secondary mx-1 rounded-pill shadow-sm d-flex align-items-center justify-content-center";

  // Context
  const { fetchCategoriesPublic, categories } = useCategory();
  const { fetchTagsPublic, tags } = useTag();
  const { fetchBrands, brands } = useProduct();

  useEffect(() => {
    fetchCategoriesPublic();
    fetchTagsPublic();
    fetchBrands();
  }, []);

  const handleRemoveFilter = (filterNames) => {
    const updatedSearchParams = { ...searchParams };

    if (typeof filterNames === "string") {
      delete updatedSearchParams[filterNames];
    } else if (Array.isArray(filterNames)) {
      filterNames.forEach((name) => {
        delete updatedSearchParams[name];
      });
    }

    updatedSearchParams.page = 1;
    const queryString = new URLSearchParams(updatedSearchParams).toString();
    const newUrl = `${pathname}?${queryString}`;
    router.push(newUrl);
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <p className="lead mb-3 text-primary font-weight-bold text-lg">
        Filter Products
      </p>
      <Link className={clearButton} href="/shop">
        Clear Filters
      </Link>

      {/* Price Filters */}
      <div className="mb-4">
        <p className="text-center mb-3 alert alert-info font-weight-bold text-md">
          Price
        </p>
        <div className="d-block">
          {priceRanges.map((range) => {
            const url = {
              pathname,
              query: {
                ...searchParams,
                minPrice: range.min,
                maxPrice: range.max,
                page: 1,
              },
            };
            const isActive =
              minPrice === String(range.min) && maxPrice === String(range.max);
            return (
              <div key={range.label} className="mb-2">
                <Link href={url} className={isActive ? activeButton : button}>
                  {range.label}
                </Link>
                {isActive && (
                  <span
                    onClick={() => handleRemoveFilter(["minPrice", "maxPrice"])}
                    className="text-danger cursor-pointer ml-2"
                  >
                    <FaTimes />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ratings Filters */}
      <div className="mb-4">
        <p className="text-center mb-3 alert alert-info font-weight-bold text-md">
          Ratings
        </p>
        <div className="d-block">
          {[5, 4, 3, 2, 1].map((ratingValue) => {
            const isActive = String(ratings) === String(ratingValue);
            const url = {
              pathname,
              query: {
                ...searchParams,
                ratings: ratingValue,
                page: 1,
              },
            };

            return (
              <div key={ratingValue} className="mb-2">
                <Link href={url} className={isActive ? activeButton : button}>
                  <Stars rating={ratingValue} />
                </Link>
                {isActive && (
                  <span
                    onClick={() => handleRemoveFilter("ratings")}
                    className="text-danger cursor-pointer ml-2"
                  >
                    <FaTimes />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories Filters */}
      <div className="mb-4">
        <p className="text-center mb-3 alert alert-info font-weight-bold text-md">
          Categories
        </p>
        <div className="d-block filter-scroll">
          {categories?.map((c) => {
            const isActive = category === c._id;
            const url = {
              pathname,
              query: {
                ...searchParams,
                category: c?._id,
                page: 1,
              },
            };

            return (
              <div key={c._id} className="mb-2">
                <Link href={url} className={isActive ? activeButton : button}>
                  {c?.name}
                </Link>
                {isActive && (
                  <span
                    onClick={() => handleRemoveFilter("category")}
                    className="text-danger cursor-pointer ml-2"
                  >
                    <FaTimes />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tags Filters */}
      {categories && (
        <div className="mb-4">
          <p className="text-center mb-3 alert alert-info font-weight-bold text-md">
            Tags
          </p>
          <div className="d-block filter-scroll">
            {tags
              ?.filter((t) => t?.parentCategory === category)
              ?.map((t) => {
                const isActive = tag === t._id;
                const url = {
                  pathname,
                  query: {
                    ...searchParams,
                    tag: t?._id,
                    page: 1,
                  },
                };

                return (
                  <div key={t._id} className="mb-2">
                    <Link
                      href={url}
                      className={isActive ? activeButton : button}
                    >
                      {t?.name}
                    </Link>
                    {isActive && (
                      <span
                        onClick={() => handleRemoveFilter("tag")}
                        className="text-danger cursor-pointer ml-2"
                      >
                        <FaTimes />
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Brands Filters */}
      <div className="mb-4">
        <p className="text-center mb-3 alert alert-info font-weight-bold text-md">
          Brands
        </p>
        <div className="d-block filter-scroll">
          {brands?.map((b) => {
            const isActive = brand === b;
            const url = {
              pathname,
              query: {
                ...searchParams,
                brand: b,
                page: 1,
              },
            };

            return (
              <div key={b} className="mb-2">
                <Link href={url} className={isActive ? activeButton : button}>
                  {b}
                </Link>
                {isActive && (
                  <span
                    onClick={() => handleRemoveFilter("brand")}
                    className="text-danger cursor-pointer ml-2"
                  >
                    <FaTimes />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
