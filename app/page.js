import Pagination from "@/components/product/Pagination";
import ProductCard from "@/components/product/ProductCard";

async function getProducts(searchParams) {
  const searchQuery = new URLSearchParams({
    page: searchParams?.page || 1,
  }).toString();

  const response = await fetch(`${process.env.API}/product?${searchQuery}`, {
    method: "GET",
    next: { revalidate: 1 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  return data;
}

export default async function Home({ searchParams }) {
  // console.log("searchParams => ", searchParams);
  const { products, currentPage, totalPages } = await getProducts(searchParams);

  return (
    <div className="container">
      <h1 className="text-center mt-2">
        <strong>Latest Products</strong>
      </h1>

      <div className="row">
        {products?.map((product) => (
          <ProductCard product={product} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pathname="/"
      />
    </div>
  );
}
