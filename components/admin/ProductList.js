"use client";

import { useEffect } from "react";
import { useProduct } from "@/context/product";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Pagination from "../product/Pagination";

export default function ProductList() {
  const {
    products,
    currentPage,
    totalPages,
    fetchProducts,
    setUpdatingProduct,
  } = useProduct();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const handleClick = (product) => {
    setUpdatingProduct(product);
    router.push("/dashboard/admin/product");
  };

  return (
    <>
      {/* Displaying Products */}
      {/* <pre>{JSON.stringify(products, null, 4)}</pre> */}
      <div className="container my-5">
        <div className="row gx-3">
          {products?.map((product) => (
            <div key={product?._id} className="col-lg-6 my-3">
              <div style={{ height: '300px', overflow: 'hidden' }}>
                <Image
                  src={product?.images[0]?.secure_url || "/images/default.jpeg"}
                  alt={product?.title}
                  width={500}
                  height={300}
                  style={{
                    objectFit: "cover",
                    height: "100%",
                    width: "100%",
                  }}
                />
              </div>
              <div className="card-body">
                <h5
                  className="card-body pointer"
                  onClick={() => handleClick(product)}
                >
                  {product?.title} | {product?.price?.toFixed(2)} DT
                </h5>
                <p className="card-text">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product?.description?.length > 160
                        ? `${product?.description.substring(0, 160)} ....`
                        : product?.description,
                    }}
                  />
                </p>
              </div>
            </div>
          ))}
        </div>
          <Pagination currentPage={currentPage} totalPages={totalPages}  
            pathname={pathname}
          />
      </div>
    </>
  );
}
