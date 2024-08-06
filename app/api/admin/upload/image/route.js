import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(image);
        return NextResponse.json({
            public_id: result.public_id,
            secure_url: result.secure_url
        });
    } catch (err) {
        console.error("Error uploading image:", err.message);
        return NextResponse.json({ error: "Failed to upload image", details: err.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { public_id } = await req.json();

        if (!public_id) {
            return NextResponse.json({ error: "No public_id provided" }, { status: 400 });
        }

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(public_id);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error deleting image:", err.message);
        return NextResponse.json({ error: "Failed to delete image", details: err.message }, { status: 500 });
    }
}
