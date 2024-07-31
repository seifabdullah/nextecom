'use client';

import { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  // State for creating a category
  const [name, setName] = useState('');

  // State for fetching categories
  const [categories, setCategories] = useState([]);

  // State for updating and deleting a category
  const [updatingCategory, setUpdatingCategory] = useState(null);

  // Function to create a category
  const createCategory = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err || 'Failed to create category');
      } else {
        toast.success('Category created');
        setName('');
        setCategories([data, ...categories]);
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Try again');
    }
  };

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/category`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err || 'Failed to fetch categories');
      } else {
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Try again');
    }
  };

  // Function to update a category
  const updateCategory = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/category/${updatingCategory._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatingCategory),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedCategory = await response.json();
      setCategories((prevCategories) =>
        prevCategories.map((c) =>
          c._id === updatedCategory._id ? updatedCategory : c
        )
      );
      setUpdatingCategory(null);
      toast.success('Category updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Try again');
    }
  };

  // Function to delete a category
  const deleteCategory = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/category/${updatingCategory?._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const deletedCategory = await response.json();

      if (!response.ok) {
        toast.error(deletedCategory.err || 'Failed to delete category');
      } else {
        setCategories((prevCategories) =>
          prevCategories.filter((c) => c._id !== deletedCategory._id)
        );
        toast.success('Category deleted successfully');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Try again');
    } finally {
      setUpdatingCategory(null); // Ensure updatingCategory is reset
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        name,
        setName,
        createCategory,
        categories,
        setCategories,
        fetchCategories,
        updatingCategory,
        setUpdatingCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
