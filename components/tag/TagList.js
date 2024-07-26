"use client";

import { useTag } from "@/context/tag";
import { useEffect } from "react";

export default function TagsList() {
    // context
    const { tags, fetchTags, setUpdatingTag } = useTag();

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    return (
        <div className="container mb-5">
            <div className="row">
                <div className="col">
                    {tags?.map((t) => (
                        <button
                            key={t._id}
                            className="btn btn-primary m-2"
                            onClick={() => {
                                setUpdatingTag(t);
                            }}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
