"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useCategory } from "@/context/category";

export default function Categories() {
    // context
    const { categories, fetchCategories, setUpdatingCategory } = useCategory();

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="container mb-5">
            <div className="row">
                <div className="col">
                    {categories.map((c) => (
                        <button
                            key={c._id} // Assuming _id or another unique identifier is available
                            className="btn"
                            onClick={() => {
                                setUpdatingCategory(c);
                            }}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
