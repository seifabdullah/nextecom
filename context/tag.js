"use client";

import { createContext, useState, useContext, useCallback } from "react";
import toast from "react-hot-toast";

export const TagContext = createContext();

export const TagProvider = ({ children }) => {
    // State variables
    const [name, setName] = useState("");
    const [parentCategory, setParentCategory] = useState("");
    const [tags, setTags] = useState([]);
    const [updatingTag, setUpdatingTag] = useState(null);
    const [loading, setLoading] = useState(false); // Added loading state

    // Function to create a tag
    const createTag = async () => {
        try {
            const response = await fetch(`${process.env.API}/admin/tag`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    parentCategory,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                toast.error(data.error || 'Failed to create tag'); // Improved error handling
            } else {
                toast.success("Tag created");
                setName("");
                setParentCategory(""); // Reset parentCategory
                setTags([data, ...tags]);
            }
        } catch (err) {
            console.error("Error creating tag:", err);
            toast.error("An error occurred while creating the tag");
        }
    };

    // Function to fetch tags
    const fetchTags = useCallback(async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`${process.env.API}/admin/tag`);
            if (!response.ok) {
                const errorText = await response.text();
                toast.error(`Error: ${response.status} - ${errorText}`);
                console.error(`Error fetching tags: ${response.status} - ${errorText}`);
                return;
            }
            const data = await response.json();
            setTags(data);
        } catch (err) {
            console.error("Error fetching tags:", err);
            toast.error("An error occurred while fetching tags. Please try again.");
        } finally {
            setLoading(false); // End loading
        }
    }, []);

    // Function to update a tag
    const updateTag = async () => {
        if (!updatingTag) return; // Avoid updating if no tag is selected

        try {
            const response = await fetch(`${process.env.API}/admin/tag/${updatingTag._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatingTag),
            });

            const data = await response.json();
            if (!response.ok) {
                toast.error(data.error || 'Failed to update tag'); // Improved error handling
            } else {
                toast.success('Tag updated');
                setUpdatingTag(null);
                setParentCategory("");
                setTags((prevTags) =>
                    prevTags.map((t) => (t._id === data._id ? data : t))
                );
            }
        } catch (err) {
            console.error("Error updating tag:", err);
            toast.error("An error occurred while updating the tag");
        }
    };

    // Function to delete a tag
    const deleteTag = async () => {
        if (!updatingTag) return; // Avoid deleting if no tag is selected

        try {
            const response = await fetch(`${process.env.API}/admin/tag/${updatingTag._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (!response.ok) {
                toast.error(data.error || 'Failed to delete tag'); // Improved error handling
            } else {
                toast.success('Tag deleted');
                setUpdatingTag(null);
                setParentCategory("");
                setTags((prevTags) =>
                    prevTags.filter((t) => t._id !== data._id)
                );
            }
        } catch (err) {
            console.error("Error deleting tag:", err);
            toast.error("An error occurred while deleting the tag");
        }
    };

    return (
        <TagContext.Provider
            value={{
                name,
                setName,
                parentCategory,
                setParentCategory,
                createTag,
                tags,
                setTags,
                fetchTags,
                updatingTag,
                setUpdatingTag,
                updateTag,
                deleteTag,
                loading, // Added loading state to context
            }}
        >
            {children}
        </TagContext.Provider>
    );
};

export const useTag = () => useContext(TagContext);
