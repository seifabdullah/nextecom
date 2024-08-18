import Pagination from "@/components/product/Pagination";
import ProductCard from "@/components/product/ProductCard";

export const metadata = {
  title: "Next E-commerce",
  description: "Find the latest in fashion, electronics and more",
};

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
  const { products, currentPage, totalPages } = await getProducts(searchParams);

  return (
    <div className="container mt-4">
      <header className="text-center mb-5">
        <h1 className="display-4 font-weight-bold">Latest Products</h1>
        <p className="lead text-muted">
          Discover the latest additions to our catalog. Browse through our
          featured products below.
        </p>
      </header>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4">
        {products?.map((product) => (
          <div
            key={product._id}
            className="col d-flex align-items-center justify-content-center"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pathname="/"
        />
      </div>
    </div>
  );
}
