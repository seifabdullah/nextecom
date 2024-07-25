
"use client"
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function TopNav(){
    const {data, status} = useSession()
    return(
        <nav className="nav shadow p-2 justify-content-between mb-3">
            <Link href="/" className="nav-link">🛒 NEXTECOM</Link>
            {status === "authenticated" ? 
                ( 
                <div className="d-flex justify-content-end">
                <Link href={`/dashboard/${data?.user?.role === "admin" ? "admin" : "user"}`} 
                className="nav-link ">
                    {data?.user?.name} ({data?.user?.role})
                </Link>
                <a  className="nav-link btn btn-outline-danger text-danger pointer" onClick={() => signOut(
                    {callbackUrl:"/login"}
                )}>Logout</a>
                </div>
                ) 
                : 
            (
            <div className="d-flex">
                <Link href="/login" className="nav-link btn btn-outline-primary">Login</Link>
                <Link href="/register" className="nav-link btn btn-outline-success">Register</Link>
            </div>
            )}

        </nav>
    )
}