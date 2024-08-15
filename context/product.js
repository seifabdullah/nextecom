'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Resizer from 'react-image-file-resizer';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // State
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingProduct, setUpdatingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  //brands
  const [brands, setBrands] = useState([])

  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [currentImagePreviewUrl, setCurrentImagePreviewUrl] = useState("");

//rating system
  const [showRatingModal,setShowRatingModal] = useState(false)
  const [currentRating,setCurrentRating] = useState(0)
  const [comment, setComment] = useState("")

  const router = useRouter();

  useEffect(() => {
    window.addEventListener("click", handleClickOutside)
    return () => {
        window.removeEventListener('click', handleClickOutside)
    }
}, [])

function handleClickOutside(event){
    if(event.target.classList.contains("modal")){
        closeModal()
    }
}
const openModal = (url) => {
    setCurrentImagePreviewUrl(url);
    setShowImagePreviewModal(true);
};

const closeModal = () => {
    setShowImagePreviewModal(false);
    setCurrentImagePreviewUrl("");
};


  const uploadImages = (e) => {
    let files = e.target.files;
    let allUploadedFiles = updatingProduct
      ? updatingProduct.images || []
      : product
      ? product?.images || []
      : [];

    if (files) {
      const totalImages = allUploadedFiles.length + files.length;
      if (totalImages > 4) {
        toast.error("You can't upload more than 4 images.");
        return;
      }

      setUploading(true);

      const uploadPromises = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const promise = new Promise((resolve) => {
          Resizer.imageFileResizer(
            file,
            1280,
            720,
            'JPEG',
            100,
            0,
            (uri) => {
              fetch(`${process.env.API}/admin/upload/image`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: uri }),
              })
                .then((response) => {
                  if (!response.ok) {
                    return response.text().then((text) => {
                      throw new Error(`HTTP error! Status: ${response.status}. Response: ${text}`);
                    });
                  }
                  return response.json();
                })
                .then((data) => {
                  allUploadedFiles.unshift(data);
                  resolve();
                })
                .catch((err) => {
                  console.error('CLOUDINARY UPLOAD ERR', err.message);
                  toast.error(`Upload failed: ${err.message}`);
                  resolve();
                });
            },
            'base64'
          );
        });

        uploadPromises.push(promise);
      }

      Promise.all(uploadPromises)
        .then(() => {
          updatingProduct
            ? setUpdatingProduct({
                ...updatingProduct,
                images: allUploadedFiles,
              })
            : setProduct({ ...product, images: allUploadedFiles });

          setUploading(false);
        })
        .catch((error) => {
          console.error('Error uploading images: ', error.message);
          setUploading(false);
        });
    }
  };

  

  const deleteImage = (public_id) => {
    setUploading(true);

    fetch(`${process.env.API}/admin/upload/image`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredImages = updatingProduct
          ? updatingProduct.images.filter(
              (image) => image.public_id !== public_id
            )
          : product.images.filter((image) => image.public_id !== public_id);

        updatingProduct
          ? setUpdatingProduct({ ...updatingProduct, images: filteredImages })
          : setProduct({ ...product, images: filteredImages });
      })
      .catch((err) => {
        toast.error('Image delete failed');
        console.log('CLOUDINARY DELETE ERR', err);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const createProduct = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/product`, {
        method: 'POST',
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success(`Product "${data?.title}" created`);E
        router.push("/dashboard/admin/product");
        // window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProducts = async (page = 1) => {
    try {
      const response = await fetch(`${process.env.API}/product?page=${page}`, {
        method: 'GET',
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

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${process.env.API}/product/brand`, {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.err);
      } else {
        setBrands(data)
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
          method: 'PUT',
          body: JSON.stringify(updatingProduct),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.err);
      } else {
        toast.success(`Product "${data?.title}" updated`);
        // router.back();
        window.location.href = "/dashboard/admin/products"
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async () => {
    setUploading(true); // Optional: Show loading state
  
    try {
      const response = await fetch(
        `${process.env.API}/admin/product/${updatingProduct?._id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorText}`);
      }
  
      const data = await response.json();
      
      toast.success(`Product "${data?.title}" deleted`);
  
      // Optionally: Redirect to previous page or update state
      router.back();
    } catch (err) {
      toast.error(`Failed to delete product: ${err.message}`);
      console.error('Product DELETE ERR', err);
    } finally {
      setUploading(false); // Hide loading state
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
        showImagePreviewModal,
        setShowImagePreviewModal, 
        currentImagePreviewUrl,
        setCurrentImagePreviewUrl,
        openModal,
        closeModal,
        showRatingModal,
        setShowRatingModal,
        currentRating,
        setCurrentRating,
        comment,
        setComment,
        brands,
        fetchBrands
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
