

// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { headers } from "next/headers";
// import Payment from "@/models/Payment";
// import { connectDB } from "@/lib/mongodb";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// export async function POST(req) {
//   try {
//     await connectDB();
//     const body = await req.text();
//     const headersList = headers();
//     const signature = headersList.get("stripe-signature");

//     let event;
//     try {
//       event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
//     } catch (err) {
//       return NextResponse.json(
//         { error: `Webhook signature verification failed: ${err.message}` },
//         { status: 400, headers: { "Cache-Control": "no-store" } } // No caching for errors
//       );
//     }

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;

//       // Update payment status in database
//       await Payment.findOneAndUpdate(
//         { stripeSessionId: session.id },
//         {
//           $set: {
//             status: "completed",
//             stripePaymentIntentId: session.payment_intent,
//           },
//         }
//       );
//     }

//     // Return success response with caching headers
//     return NextResponse.json(
//       { received: true },
//       {
//         headers: {
//           "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800", // Cache for 1 hour
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Webhook error:", error);
//     return NextResponse.json(
//       { error: "Webhook handler failed" },
//       { status: 500, headers: { "Cache-Control": "no-store" } } // No caching for errors
//     );
//   }
// }



import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import Payment from "@/models/Payment";
import { connectDB } from "@/lib/mongodb";
import * as Sentry from "@sentry/nextjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const transaction = Sentry.startTransaction({
    op: "stripeWebhook",
    name: "Stripe Webhook Processing",
  });

  try {
    await connectDB();
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get("stripe-signature");

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      Sentry.captureException(err, {
        tags: { route: "POST /api/webhook" },
        extra: { body, signature },
      });
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Update payment status in database
      await Payment.findOneAndUpdate(
        { stripeSessionId: session.id },
        {
          $set: {
            status: "completed",
            stripePaymentIntentId: session.payment_intent,
          },
        }
      );

      Sentry.addBreadcrumb({
        category: "payment",
        message: `Payment completed for session ${session.id}`,
        level: Sentry.Severity.Info,
      });
    }

    return NextResponse.json(
      { received: true },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        },
      }
    );
  } catch (error) {
    Sentry.captureException(error, {
      tags: { route: "POST /api/webhook" },
    });
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  } finally {
    transaction.finish();
  }
}



