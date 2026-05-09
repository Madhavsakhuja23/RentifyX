/**
 * useRazorpay.js
 * 
 * Custom hook that dynamically loads the Razorpay checkout script,
 * creates an order via the backend, and opens the payment modal.
 * 
 * Usage:
 *   const { openRazorpay, loading, error } = useRazorpay();
 *   openRazorpay({ amountInPaise, receipt, prefill, onSuccess, onFailure, onDismiss });
 */

import { useState, useCallback } from "react";
import { createRazorpayOrderApi, verifyRazorpayPaymentApi } from "../api";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`)) {
      // Script already present — resolve immediately
      resolve(!!window.Razorpay);
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useRazorpay() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const openRazorpay = useCallback(async ({
    amountInPaise,     // e.g. 50000 for ₹500
    receipt,           // optional receipt string
    prefill = {},      // { name, email, contact }
    description = "RentifyX Booking",
    onSuccess,         // ({ paymentId, orderId, signature }) => void
    onFailure,         // (errorMsg) => void
    onDismiss,         // () => void
  }) => {
    setError(null);
    setLoading(true);

    try {
      // Step 1: Load the Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay checkout. Please check your internet connection.");
      }

      // Step 2: Create an order on the backend
      const orderData = await createRazorpayOrderApi(amountInPaise, receipt);

      // Step 3: Open the Razorpay modal
      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!keyId) {
        throw new Error("Razorpay key ID is not configured. Check VITE_RAZORPAY_KEY_ID in .env.");
      }

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "RentifyX",
        description,
        order_id: orderData.order_id,
        prefill,
        theme: { color: "#FF6600" },
        handler: async (response) => {
          // Step 4: Verify the payment signature on the backend
          try {
            const verification = await verifyRazorpayPaymentApi(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verification.success) {
              onSuccess?.({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              });
            } else {
              const msg = "Payment verification failed. Please contact support.";
              setError(msg);
              onFailure?.(msg);
            }
          } catch (verifyErr) {
            const msg = verifyErr.message || "Payment verification error.";
            setError(msg);
            onFailure?.(msg);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            onDismiss?.();
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        const msg = response.error?.description || "Payment failed. Please try again.";
        setError(msg);
        setLoading(false);
        onFailure?.(msg);
      });

      rzp.open();
    } catch (err) {
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      setLoading(false);
      onFailure?.(msg);
    } finally {
      // Note: loading is cleared inside modal callbacks (ondismiss / handler)
      // so we only stop loading here on error paths
    }
  }, []);

  return { openRazorpay, loading, error, setError };
}
