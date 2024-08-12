'use client';

import Image from "next/image";
import { useProduct } from "@/context/product";
import Modal from "@/components/Modal"

export default function ProductImage({ product }) {
    const { 
        showImagePreviewModal,
         currentImagePreviewUrl, 
         openModal, 
         } = useProduct()

    const showImage = (src, title) => (
        <Image
            src={src}
            className="card-img-top"
            width={500}
            height={300}
            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
            alt={title}
        />
    );

    return (
        <>
            {showImagePreviewModal && (
                <Modal>{showImage(currentImagePreviewUrl, product?.title)}</Modal>
            )}
            <div className="d-flex justify-content-center align-items-center">
                { product?.images?.length > 0 ? (
                    product?.images?.map((image) => (
                        <div
                            key={image?.public_id}
                            style={{ height: '350px', overflow: 'hidden' }}
                            className="pointer"
                            onClick={() => openModal(image?.secure_url)}
                        >
                            {showImage(image?.secure_url, product.title)}
                        </div>
                    ))
                ) : (
                    <div
                        style={{ height: '350px', overflow: 'hidden' }}
                        className="pointer"
                        onClick={() => openModal('/images/default.jpeg')}
                    >
                        {showImage('/images/default.jpeg', product?.title)}
                    </div>
                )}
            </div>
        </>
    );
}
