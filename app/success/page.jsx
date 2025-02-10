import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import Payment from "@/models/Payment";
import Stripe from "stripe";
import Link from "next/link";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SuccessPage = async ({ searchParams }) => {
  const session = await getServerSession(options);
  const { session_id } = await searchParams;

  if (!session) {
    redirect("/api/auth/signin");
  }

  if (!session_id) {
    redirect("/billing");
  }

  try {
    // Verify the Stripe session first
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

    if (stripeSession.payment_status !== "paid") {
      redirect("/billing");
    }

    // Find and update the payment status
    const payment = await Payment.findOneAndUpdate(
      { stripeSessionId: session_id },
      {
        $set: {
          status: "completed",
          stripePaymentIntentId: stripeSession.payment_intent,
        },
      },
      { new: true }
    );

    if (!payment) {
      redirect("/billing");
    }

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Payment Successful!
          </h2>

          <div className="space-y-4">
            <div className="border-t border-b py-4">
              <p className="text-gray-600">Product: {payment.productName}</p>
              <p className="text-gray-600">Amount: ${payment.amount}</p>
              <p className="text-gray-600">
                Date: {new Date(payment.paymentDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Transaction ID: {payment.stripePaymentIntentId}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          {/* <button className="px-6 py-2 bg-green-600 rounded-[20px]">
            Go Billing
          </button> */}
          <Link
            href="/billing"
            className="px-6 py-2 bg-green-600 text-white rounded-[20px] hover:bg-green-700 transition-colors"
          >
            Go Billing
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Success page error:", error);
    redirect("/billing");
  }
};

export default SuccessPage;
