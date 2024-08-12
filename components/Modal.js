"use client";
import { useProduct } from "@/context/product";

export default function ProductImage({ children }) {
    const { closeModal } = useProduct();

    return (
        <>
            <div className="modal fade show" style={{ display: "block" }}>
                <div
                    className="modal-dialog modal-dialog-centered"
                    style={{ maxWidth: "40%", maxHeight: "70%" }}
                >
                    <div
                        className="modal-content"
                        style={{ borderRadius: "0.25rem" }}
                    >
                        <div className="modal-body" style={{ padding: "1rem" }}>
                            {children}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
