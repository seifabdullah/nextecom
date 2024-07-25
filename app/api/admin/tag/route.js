import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Tag from "@/models/tag";
import slugify from "slugify";

export async function POST(req) {
    const _req = await req.json();
    await dbConnect();

    try {
        const { name, parent } = _req;

        // Create a slug from the name
        const slug = slugify(name);

        // Create a new Tag document
        const tag = await Tag.create({
            name,
            parent,
            slug: slugify(name),
        });

        // Return the created tag as JSON response
        return NextResponse.json(tag);
    } catch (err) {
        console.error(err);

        // Handle server error with appropriate JSON response
        return NextResponse.json(
            {
                err: "Server error. Please try again.",
            },
            {
                status: 500,
            }
        );
    }
}


export async function GET(){
    await dbConnect()
    try{
        const tags = await Tag.find({}).sort({createdAt: -1})
        return NextResponse.json(tags)
    }catch(err){
        return NextResponse.json(err.message,{status:500})
    }
}
