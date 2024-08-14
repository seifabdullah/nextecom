"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { priceRanges } from "@/utils/filterData";
import Link from "next/link";
import Stars from "./Stars";
import { useCategory } from "@/context/category";
import { useTag } from "@/context/tag";

export default function ProductFilter({ searchParams }) {
    const router = useRouter(); 
    const pathname = "/shop";
    const { minPrice, maxPrice, tag, brand, category, ratings } = searchParams || {}; 

    const activeButton = "btn btn-primary btn-raised mx-1 rounded-pill d-block shadow-sm";
    const button = "btn btn-outline-secondary border-20 mx-1 d-block rounded-pill shadow-sm";
    const clearButton = "btn btn-outline-danger btn-light  mx-1 rounded-pill d-block shadow-sm";

    // Context 
    const { fetchCategoriesPublic, categories } = useCategory();
    const { fetchTagsPublic, tags } = useTag();

    useEffect(() => {
        fetchCategoriesPublic();
        fetchTagsPublic();
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
        <div className="p-4 border rounded shadow bg-light">
            <p className="lead mb-3 text-primary font-weight-bold" style={{ fontSize: '1.25rem' }}>Filter Products</p>
            <Link className={clearButton} href="/shop">Clear Filters</Link>
            
            {/* Price Filters */}
            <div className="mb-4">
                <p className="text-center mb-3 alert alert-secondary font-weight-bold" style={{ fontSize: '1.1rem' }}>Price</p>
                <div className="row mx-1">
                    {priceRanges.map((range) => {
                        const url = {
                            pathname,
                            query: {
                                ...searchParams,
                                minPrice: range.min,
                                maxPrice: range.max,
                                page: 1
                            }
                        };
                        const isActive =
                            minPrice === String(range.min) &&
                            maxPrice === String(range.max);
                        return (
                            <div key={range.label} className="col-12 col-md-6 mb-2">
                                <Link href={url} className={isActive ? activeButton : button}>
                                    {range.label}
                                </Link>
                                {isActive && (
                                    <span
                                        onClick={() => handleRemoveFilter(["minPrice", "maxPrice"])}
                                        className="text-danger ml-2"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className="bi bi-x-circle"></i>
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Ratings Filters */}
            <div className="mb-4">
                <p className="text-center mb-3 alert alert-secondary font-weight-bold" style={{ fontSize: '1.1rem' }}>Ratings</p>
                <div className="row mx-1">
                    {[5, 4, 3, 2, 1].map((ratingValue) => {
                        const isActive = String(ratings) === String(ratingValue);
                        const url = {
                            pathname,
                            query: {
                                ...searchParams,
                                ratings: ratingValue,
                                page: 1
                            }
                        };

                        return (
                            <div key={ratingValue} className="col-12 col-md-6 mb-2">
                                <Link href={url} className={isActive ? activeButton : button}>
                                    <Stars rating={ratingValue}/>
                                </Link>
                                {isActive && (
                                    <span
                                        onClick={() => handleRemoveFilter("ratings")}
                                        className="text-danger ml-2"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className="bi bi-x-circle"></i>
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Categories Filters */}
            <div className="mb-4">
                <p className="text-center mb-3 alert alert-secondary font-weight-bold" style={{ fontSize: '1.1rem' }}>Categories</p>
                <div className="row mx-1 filter-scroll">
                    {categories?.map((c) => {
                        const isActive = category === c._id;
                        const url = {
                            pathname,
                            query: {
                                ...searchParams,
                                category: c?._id,
                                page: 1
                            }
                        };

                        return (
                            <div key={c._id} className="col-12 col-md-6 mb-2">
                                <Link href={url} className={isActive ? activeButton : button}>
                                    {c?.name}
                                </Link>
                                {isActive && (
                                    <span
                                        onClick={() => handleRemoveFilter("category")}
                                        className="text-danger ml-2"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className="bi bi-x-circle"></i>
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
                    <p className="text-center mb-3 alert alert-secondary font-weight-bold" style={{ fontSize: '1.1rem' }}>Tags</p>
                    <div className="row mx-1 filter-scroll">
                        {tags
                            ?.filter((t) => t?.parentCategory === category)
                            ?.map((t) => {
                            const isActive = tag === t._id;
                            const url = {
                                pathname,
                                query: {
                                    ...searchParams,
                                    tag: t?._id,
                                    page: 1
                                }
                            };

                            return (
                                <div key={t._id} className="col-12 col-md-6 mb-2">
                                    <Link href={url} className={isActive ? activeButton : button}>
                                        {t?.name}
                                    </Link>
                                    {isActive && (
                                        <span
                                            onClick={() => handleRemoveFilter("tag")}
                                            className="text-danger ml-2"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <i className="bi bi-x-circle"></i>
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Debugging Information (Optional) */}
            {/* <pre>{JSON.stringify(searchParams, 4, null)}</pre> */}
        </div>
    );
}
