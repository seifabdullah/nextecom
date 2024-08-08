'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProductImage({ product }) {
    const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
    const [currentImagePreviewUrl, setCurrentImagePreviewUrl] = useState("");

    useEffect(() => {
        //close modal on clicks on page
        window.addEventListener("click", handleClickOutside)
        return () => {
            window.removeEventListener('click', handleClickOutside)
        }
    }, [])

    function handleClickOutside(event){
        if(event.target.classList.contains("modal")){
            closeModal()
        }
    }
    const openModal = (url) => {
        setCurrentImagePreviewUrl(url);
        setShowImagePreviewModal(true);
    };

    const closeModal = () => {
        setShowImagePreviewModal(false);
        setCurrentImagePreviewUrl("");
    };



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
                <div className="modal fade-show" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-body d-flex justify-content-center align-items-center">
                                <Image
                                    src={currentImagePreviewUrl}
                                    width={800} 
                                    height={600} 
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '80vh', 
                                        objectFit: 'contain'
                                    }}
                                    alt={product?.title}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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
