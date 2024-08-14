import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import { currentUser } from "@/utils/currentUser";

export async function POST(req) {
  await dbConnect();
  
  const body = await req.json();
  console.log("_req in rating route", body);
  
  const { productId, rating, comment } = body;
  const user = await currentUser(req);

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { err: "Product not found." },
        { status: 404 }
      );
    }

    // Check if the user has already rated the product
    const existingRating = product.ratings.find(
      (rate) => rate.postedBy.toString() === user._id.toString()
    );

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
      existingRating.comment = comment;
      await product.save();
      return NextResponse.json(product, { status: 200 });
    }

    // Add a new rating
    product.ratings.push({
      rating,
      comment,
      postedBy: user._id 
    });

    const updated = await product.save();
    return NextResponse.json(updated, { status: 200 });
    
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { err: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
