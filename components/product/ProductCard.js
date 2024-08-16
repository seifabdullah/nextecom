import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import ProductRating from "./ProductRating";

dayjs.extend(relativeTime);

export default function ProductCard({ product }) {
  return (
    <div className="card shadow-sm border-light rounded d-flex flex-column">
      <div className="card-image-container">
        <Image
          src={product?.images?.[0]?.secure_url || "/images/default.jpeg"}
          width={500}
          height={300}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          alt={product?.title || "Product Image"}
        />
      </div>
      <div className="card-body d-flex flex-column">
        <Link
          href={`/product/${product?.slug}`}
          className="text-decoration-none"
        >
          <h5 className="card-title text-dark">{product?.title}</h5>
          <p className="card-price text-primary">
            <strong>{product?.price.toFixed(2)} TND</strong>
          </p>
        </Link>
        <p className="card-description text-muted mt-2">
          {product?.description.length > 120
            ? `${product?.description.substring(0, 120)}...`
            : product?.description}
        </p>
        <div className="mt-auto">
          <small className="text-muted">
            <strong>Category:</strong> {product?.category?.name}
          </small>
          <small className="text-muted">
            <strong>Tags:</strong>{" "}
            {product?.tags?.map((t) => t?.name).join(", ")}
          </small>
          <small className="text-muted">Likes 🤍</small>
          <small className="text-muted">
            Posted {dayjs(product?.createdAt).fromNow()}
          </small>
          <small className="text-muted">
            <strong>Brand:</strong> {product?.brand}
          </small>
          <ProductRating product={product} leaveARating={false} />
        </div>
      </div>
    </div>
  );
}
