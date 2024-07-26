"use client"

import "./globals.css";
import "bootstrap-material-design/dist/css/bootstrap-material-design.min.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import TopNav from "@/components/nav/TopNav";
import { CategoryProvider } from "@/context/category";
import { TagProvider } from "@/context/tag";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionProvider>
        <CategoryProvider>
        <TagProvider>
        <body>
          <TopNav />
          <Toaster />
          {children}
        </body>
        </TagProvider>
        </CategoryProvider>
      </SessionProvider>
    </html>
   
   
  );
}
