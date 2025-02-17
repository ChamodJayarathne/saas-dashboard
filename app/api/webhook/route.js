

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



// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { headers } from "next/headers";
// import Payment from "@/models/Payment";
// import { connectDB } from "@/lib/mongodb";
// import * as Sentry from "@sentry/nextjs";
// import { getNotificationServer } from '@/lib/websocket'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// export async function POST(req) {
//   const transaction = Sentry.startTransaction({
//     op: "stripeWebhook",
//     name: "Stripe Webhook Processing",
//   });

//   try {
//     await connectDB();
//     const body = await req.text();
//     const headersList = headers();
//     const signature = headersList.get("stripe-signature");

//     let event;
//     try {
//       event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
//     } catch (err) {
//       Sentry.captureException(err, {
//         tags: { route: "POST /api/webhook" },
//         extra: { body, signature },
//       });
//       return NextResponse.json(
//         { error: `Webhook signature verification failed: ${err.message}` },
//         { status: 400, headers: { "Cache-Control": "no-store" } }
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

//       // Sentry.addBreadcrumb({
//       //   category: "payment",
//       //   message: `Payment completed for session ${session.id}`,
//       //   level: Sentry.Severity.Info,
//       // });
//     }

//     try {
//       const notificationData = {
//         title: "Payment Successful",
//         message: `Payment of $${(session.amount_total / 100).toFixed(2)} for ${session.metadata.productName} completed`,
//         userId: session.metadata.userId,
//         type: "payment",
//         timestamp: new Date().toISOString()
//       };

//       if (process.env.NODE_ENV === "production") {
//         await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notify`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(notificationData),
//         });
//       } else {
//         // For development, send directly to WebSocket server
//         await fetch("http://localhost:3000/api/notify", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(notificationData),
//         });
//       }

//       Sentry.addBreadcrumb({
//         category: "notification",
//         message: "Sent payment completion notification",
//         level: Sentry.Severity.Info,
//       });
//     } catch (error) {
//       Sentry.captureException(error, {
//         tags: { section: "paymentNotification" },
//       });
//     }
  


//     return NextResponse.json(
//       { received: true },
//       {
//         headers: {
//           "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
//         },
//       }
//     );
//   } catch (error) {
//     Sentry.captureException(error, {
//       tags: { route: "POST /api/webhook" },
//     });
//     return NextResponse.json(
//       { error: "Webhook handler failed" },
//       { status: 500, headers: { "Cache-Control": "no-store" } }
//     );
//   } finally {
//     transaction.finish();
//   }
// }
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import Payment from "@/models/Payment";
import { connectDB } from "@/lib/mongodb";
import * as Sentry from "@sentry/node";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const transaction = Sentry.startTransaction({
    op: "stripeWebhook",
    name: "Process Stripe Webhook",
  });

  try {
    // Validate environment configuration
    if (!webhookSecret) {
      Sentry.captureMessage("Stripe webhook secret not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }

    await connectDB();
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get("stripe-signature");

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      Sentry.addBreadcrumb({
        category: "webhook",
        message: "Stripe event constructed successfully",
        level: Sentry.Severity.Info,
      });
    } catch (err) {
      Sentry.captureException(err, {
        tags: { route: "POST /api/webhook" },
        extra: { body, signature },
      });
      return NextResponse.json(
        { error: "Webhook verification failed" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        Sentry.addBreadcrumb({
          category: "webhook",
          message: `Processing completed session: ${session.id}`,
          level: Sentry.Severity.Info,
        });

        const updateResult = await Payment.findOneAndUpdate(
          { stripeSessionId: session.id },
          {
            $set: {
              status: "completed",
              stripePaymentIntentId: session.payment_intent,
              updatedAt: new Date(),
            },
          },
          { new: true }
        );

        if (!updateResult) {
          Sentry.captureMessage(`Payment record not found for session: ${session.id}`);
          return NextResponse.json(
            { error: "Payment record not found" },
            { status: 404, headers: { "Cache-Control": "no-store" } }
          );
        }

        Sentry.addBreadcrumb({
          category: "database",
          message: `Updated payment status for session: ${session.id}`,
          level: Sentry.Severity.Info,
        });
      }

      return NextResponse.json(
        { received: true },
        { headers: { "Cache-Control": "no-store" } } // Webhooks shouldn't be cached
      );
    } catch (processingError) {
      Sentry.captureException(processingError, {
        tags: { eventType: event.type },
        extra: { eventId: event.id },
      });
      return NextResponse.json(
        { error: "Failed to process webhook event" },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { route: "POST /api/webhook" },
    });
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  } finally {
    transaction.finish();
  }
}


