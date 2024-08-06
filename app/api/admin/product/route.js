import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from '@/models/product'
import slugify from "slugify";

export async function POST(req) {
    await dbConnect();
    const body = await req.json();

    console.log('Received body:', body);

    if (!body.title || !body.description || !body.price) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const product = await Product.create({
            ...body,
            slug: slugify(body.title),
        });
        console.log('Product created:', product);
        return NextResponse.json(product);
    } catch (err) {
        console.error('Error creating product:', err);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
