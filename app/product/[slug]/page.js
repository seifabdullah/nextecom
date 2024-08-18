import ProductImage from "@/components/product/ProductImage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ProductLike from "@/components/product/ProductLike";
import ProductRating from "@/components/product/ProductRating";
import UserReviews from "@/components/product/UserReviews";

dayjs.extend(relativeTime);

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  return {
    title: product?.title,
    description: product?.description?.substr(0, 160),
    openGraph: {
      image: product?.images[0]?.url,
    },
  };
}

async function getProduct(slug) {
  const response = await fetch(`${process.env.API}/product/${slug}`, {
    method: "GET",
    next: { revalidate: 1 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  const data = await response.json();
  return data;
}

export default async function ProductViewPage({ params }) {
  const product = await getProduct(params?.slug);

  // Inline styles
  const containerStyle = {
    margin: "2rem auto",
    maxWidth: "1200px",
    padding: "0 15px",
  };

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "0.75rem",
    overflow: "hidden",
    backgroundColor: "#fff",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    marginTop: "1.5rem",
    padding: "1.5rem",
  };

  const cardHoverStyle = {
    transform: "translateY(-8px)",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "1.5rem",
  };

  const descriptionStyle = {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "1.5rem",
  };

  const footerStyle = {
    padding: "1rem",
    borderTop: "1px solid #eee",
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const relatedProductsHeadingStyle = {
    textAlign: "center",
    marginTop: "3rem",
    marginBottom: "2rem",
  };

  return (
    <div style={containerStyle}>
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          {/* Card */}
          <div style={cardStyle} className="card">
            {/* Product Title */}
            <h1 style={titleStyle}>{product?.title}</h1>

            {/* Product Image */}
            <div className="card-image-container" style={{ height: "220px" }}>
              <ProductImage product={product} />
            </div>

            {/* Product Description */}
            <div
              style={descriptionStyle}
              dangerouslySetInnerHTML={{
                __html: product?.description.replace(/\./g, "<br/>"),
              }}
            />

            {/* Product Details */}
            <div style={footerStyle} className="card-footer">
              <small>
                <strong>Category:</strong> {product?.category?.name}
              </small>
              <small>
                <strong>Tags:</strong>{" "}
                {product?.tags?.map((t) => t?.name).join(", ")}
              </small>
              <div className="d-flex align-items-center">
                <ProductLike product={product} />
                <small className="ms-2">
                  Posted {dayjs(product?.createdAt).fromNow()}
                </small>
              </div>
            </div>

            {/* Brand and Rating */}
            <div style={footerStyle} className="card-footer">
              <small>
                <strong>Brand:</strong> {product?.brand}
              </small>
              <div className="d-flex align-items-center">
                <ProductRating product={product} />
              </div>
            </div>

            {/* User Reviews */}
            <div className="card-footer mt-4">
              <UserReviews reviews={product?.ratings} />
            </div>
          </div>

          {/* Related Products */}
          <div className="row">
            <div className="col">
              <h4 style={relatedProductsHeadingStyle}>Related Products</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
