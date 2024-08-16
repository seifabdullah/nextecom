"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useProduct } from "@/context/product";

export default function TopNav() {
  const { data, status } = useSession();
  const {
    productSearchQuery,
    setProductSearchQuery,
    fetchProductSearchResults,
  } = useProduct();
  return (
    <nav className="nav shadow p-2 justify-content-between mb-3">
      <div className="d-flex">
        <Link href="/" className="nav-link">
          🛒 NEXTECOMMERCE
        </Link>
        <Link href="/shop" className="nav-link">
          Shop
        </Link>
      </div>

      <form
        className="d-flex mx-2 mb-0"
        role="search"
        onSubmit={fetchProductSearchResults}
      >
        <input
          type="search"
          className="form-control"
          placeholder="Search Products"
          aria-label="Search"
          onChange={(e) => setProductSearchQuery(e.target.value)}
        ></input>
        <button className="btn rounded-pill" type="submit">
          &#128270;
        </button>
      </form>

      {status === "authenticated" ? (
        <div className="d-flex justify-content-end">
          <Link
            href={`/dashboard/${
              data?.user?.role === "admin" ? "admin" : "user"
            }`}
            className="nav-link "
          >
            {data?.user?.name} ({data?.user?.role})
          </Link>
          <a
            className="nav-link btn btn-outline-danger text-danger pointer"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </a>
        </div>
      ) : (
        <div className="d-flex">
          <Link href="/login" className="nav-link btn btn-outline-primary">
            Login
          </Link>
          <Link href="/register" className="nav-link btn btn-outline-success">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
