import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import OrderSummary from "@/components/product/cart/OrderSummary";

export default function Step2({ onNextStep, onPrevStep }) {
  const { data, status, update } = useSession();
  // state
  const [deliveryAddress, setDeliveryAddress] = useState(
    data?.user?.deliveryAddress || ""
  );
  // update or confirm delivery address on next click
  const handleAddressThenNext = async () => {
    // update delivery address
    try {
      const response = await fetch(`${process.env.API}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryAddress }),
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.err);
        return;
      } else {
        const data = await response.json();
        // console.log("address updated, update user session", data);
        update({ user: { ...data.user, deliveryAddress: data } });
        // take to next step
        onNextStep();
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("An error occurred. Please try again.");
    }
  };
  if (status !== "authenticated") {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="d-flex justify-content-end my-4">
              <button
                className="btn btn-outline-danger btn-raised col-6"
                onClick={onPrevStep}
              >
                Previous
              </button>
              <Link
                className="btn btn-primary btn-raised col-6"
                href={`/login?callbackUrl=${window.location.href}`}
              >
                Login to Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8">
          <p className="alert alert-primary">Contact Details / Login</p>
          <div>
            <input
              type="text"
              value={data?.user?.name}
              className="form-control mb-2 px-2"
              placeholder="Your name"
              disabled
            />
            <input
              type="email"
              value={data?.user?.email}
              className="form-control mb-2 px-2"
              placeholder="Your email"
              disabled
            />
            {/* delivery address */}
            <textarea
              maxLength="320"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="form-control mb-2 px-2 mt-4"
              placeholder="Enter your delivery address"
              rows="5"
            />
            {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
          </div>
          <div className="d-flex justify-content-end my-4">
            <button
              className="btn btn-outline-danger btn-raised col-6"
              onClick={onPrevStep}
            >
              Previous
            </button>
            <button
              className="btn btn-danger btn-raised col-6"
              onClick={handleAddressThenNext}
              disabled={!deliveryAddress.trim()}
            >
              Next
            </button>
          </div>
        </div>
        <div className="col-lg-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
