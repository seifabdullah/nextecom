'use client'

import { createContext, useState, useContext } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // State
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingProduct, setUpdatingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  const uploadImages = (e) => {
    console.log(e.target.files);
  };

  const deleteImage = (public_id) => {
    //
  };

  const createProduct = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/product`, {
        method: "POST",
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success(`Product "${data?.title}" created`);
        // router.push("/dashboard/admin/products");
        // window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProducts = async (page = 1) => {
    try {
      const response = await fetch(`${process.env.API}/product?page=${page}`, {
        method: "GET",
      });

      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data?.err);
      } else {
        setProducts(data?.products);
        setCurrentPage(data?.currentPage);
        setTotalPages(data?.totalPages);
      }
    } catch (err) {
      console.log(err);
    }
  };


  const updateProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/product/${updatingProduct?._id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatingProduct),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.err);
      } else {
        toast.success(`Product "${data?.title}" updated`);
        router.back();
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const deleteProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/product/${updatingProduct?._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.err);
      } else {
        toast.success(`Product "${data?.title}" deleted`);
        router.back();
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <ProductContext.Provider
      value={{
        product,
        setProduct,
        products,
        setProducts,
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        updatingProduct,
        setUpdatingProduct,
        uploading,
        setUploading,
        uploadImages,
        deleteImage,
        createProduct,
        fetchProducts,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
  };
  export const useProduct = () => useContext(ProductContext);
  

