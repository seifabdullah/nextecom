"use client";

import { useEffect } from "react";
import { useProduct } from "@/context/product";
import { useCategory } from "@/context/category";
import { useTag } from "@/context/tag";

export default function ProductCreate() {
  const {
    product,
    setProduct,
    updatingProduct,
    setUpdatingProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploading,
    setUploading,
    uploadImages,
    deleteImage,
  } = useProduct();

  const { categories, fetchCategories } = useCategory();
  const { tags, fetchTags } = useTag();

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, [fetchCategories, fetchTags]);

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    if (updatingProduct) {
      setUpdatingProduct({ ...updatingProduct, [field]: value });
    } else {
      setProduct({ ...product, [field]: value });
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const category = categories.find((c) => c._id === categoryId);

    if (updatingProduct) {
      setUpdatingProduct({ ...updatingProduct, category });
    } else {
      setProduct({ ...product, category });
    }
  };

  return (
    <div>
      <p className="lead">
        {updatingProduct ? "Update" : "Create"} Product
      </p>
      <input
        type="text"
        placeholder="Title"
        value={updatingProduct ? updatingProduct?.title : product?.title || ""}
        onChange={handleInputChange('title')}
        className="form-control p-2 my-2"
      />
      <textarea
        cols="30"
        rows="5"
        className="form-control p-2 mb-2"
        placeholder="Description"
        value={updatingProduct ? updatingProduct?.description : product?.description || ""}
        onChange={handleInputChange('description')}
      ></textarea>
      <input
        type="number"
        placeholder="Price"
        min="1"
        className="form-control p-2 mb-2"
        value={updatingProduct ? updatingProduct?.price : product?.price || ""}
        onChange={handleInputChange('price')}
      />
      <input
        type="text"
        placeholder="Color"
        value={updatingProduct ? updatingProduct?.color : product?.color || ""}
        onChange={handleInputChange('color')}
        className="form-control p-2 my-2"
      />
      <input
        type="text"
        placeholder="Brand"
        value={updatingProduct ? updatingProduct?.brand : product?.brand || ""}
        onChange={handleInputChange('brand')}
        className="form-control p-2 my-2"
      />
      <input
        type="number"
        placeholder="Stock"
        min="1"
        className="form-control p-2 mb-2"
        value={updatingProduct ? updatingProduct?.stock : product?.stock || ""}
        onChange={handleInputChange('stock')}
      />

      <div className="form-group">
        <select
          name="category"
          className="form-control p-2 mb-2"
          onChange={handleCategoryChange}
          value={updatingProduct ? updatingProduct?.category?._id : product?.category?._id || ""}
        >
          <option value="">Select category</option>
          {categories?.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex flex-wrap justify-content-evenly align-items-center">
  {tags
    ?.filter(
      (tag) =>
        tag?.parentCategory ===
        (updatingProduct?.category?._id || product?.category?._id)
    )
    ?.map((tag) => (
      <div key={tag?._id} className="form-check">
        <input
          type="checkbox"
          value={tag?._id}
          onChange={(e) => {
            const tagId = e.target.value;
            const tagName = tag?.name;
            let selectedTags = updatingProduct
              ? [...(updatingProduct?.tags ?? [])]
              : [...(product?.tags ?? [])];

            if (e.target.checked) {
              selectedTags.push({ _id: tagId, name: tagName });
            } else {
              selectedTags = selectedTags.filter((t) => t._id !== tagId);
            }

            if (updatingProduct) {
              setUpdatingProduct({
                ...updatingProduct,
                tags: selectedTags,
              });
            } else {
              setProduct({ ...product, tags: selectedTags });
            }
          }}
        />
        <label>{tag?.name}</label>
      </div>
    ))}
</div>

      
      <pre>
        {JSON.stringify(product, null, 4)}
      </pre>
    </div>
  );
}
