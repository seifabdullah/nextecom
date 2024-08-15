import Pagination from "@/components/product/Pagination";
import ProductFilter from "@/components/product/ProductFilter";
import ProductCard from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

async function getProducts(searchParams) {
  const searchQuery = new URLSearchParams({
    page: searchParams.page || 1,
    minPrice: searchParams.minPrice || "",
    maxPrice: searchParams.maxPrice || "",
    ratings: searchParams.ratings || "",
    category: searchParams.category || "",
    tag: searchParams.tag || "",
    brand: searchParams.brand || "",
  }).toString();

  console.log("Constructed searchQuery:", searchQuery);

  try {
    const response = await fetch(
      `${process.env.API}/product/filters?${searchQuery}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products, status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response data:", data);

    if (!data || !Array.isArray(data.products)) {
      throw new Error("No products returned or invalid data format");
    }

    return data;
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return { products: [], currentPage: 1, totalPages: 1 };
  }
}

export default async function Shop({ searchParams }) {
  console.log("searchParams in shop page => ", searchParams);
  const { products, currentPage, totalPages } = await getProducts(searchParams);

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-md-4 col-lg-3 overflow-auto"
          style={{ maxHeight: "90vh" }}
        >
          <ProductFilter searchParams={searchParams} />
        </div>
        <div
          className="col-md-8 col-lg-9 overflow-auto"
          style={{ maxHeight: "90vh" }}
        >
          <div className="p-4">
            <h2 className="mb-4 text-center fw-bold mt-3">
              Shop latest Products
              <br />
              <div className="row">
                {products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <p className="text-center">No products available.</p>
                )}
              </div>
            </h2>
          </div>
          <br />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            searchParam={searchParams}
            pathname="/shop"
          />
        </div>
      </div>
    </div>
  );
}
