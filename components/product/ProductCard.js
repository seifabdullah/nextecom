import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import ProductRating from "./ProductRating";

dayjs.extend(relativeTime);

export default function ProductCard({ product }) {
  return (
    <div className="card mb-4 col-lg-4 my-3">
      <div className="card-image-container">
        <Image
          src={product?.images?.[0]?.secure_url || "/images/default.jpeg"}
          width={500}
          height={300}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          alt={product?.title || "Product Image"}
        />
      </div>

      <div className="card-body">
        <Link href={`/product/${product?.slug}`}>
          <h5 className="card-title">{product?.title}</h5>
        </Link>
        <p className="card-description">
          {product?.description.length > 160
            ? `${product?.description.substring(0, 160)}...`
            : product?.description}
        </p>
        <p className="card-price">{product?.price.toFixed(2)} tnd</p>
      </div>

      <div className="card-footer d-flex justify-content-between">
        <small>
          <strong>Category:</strong> {product?.category?.name}
        </small>
        <small>
          <strong>Tags:</strong> {product?.tags?.map((t) => t?.name).join(", ")}
        </small>
      </div>

      <div className="card-footer d-flex justify-content-between">
        <small>Likes 🤍</small>
        <small>Posted {dayjs(product?.createdAt).fromNow()}</small>
      </div>

      <div className="card-footer d-flex justify-content-between align-items-center">
        <small>
          <strong>Brand:</strong> {product?.brand}
        </small>
        <ProductRating product={product} leaveARating={false} />
      </div>
    </div>
  );
}
