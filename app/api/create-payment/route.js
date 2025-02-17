import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import Payment from "@/models/Payment";
import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    // 1. Connect to DB and check authentication
    await connectDB();
    const session = await getServerSession(options);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } } // No caching for unauthorized responses
      );
    }

    // 2. Get request data
    const { productId, price, title } = await req.json();

    // 3. Validate required fields
    if (!productId || !price || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: { "Cache-Control": "no-store" } } // No caching for invalid requests
      );
    }

    // 4. Create Stripe session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: {
        userId: session.user.id,
        productId: productId,
        productName: title,
      },
    });

    // 5. Create payment record
    const payment = new Payment({
      userId: new ObjectId(session.user.id),
      productId: productId,
      productName: title,
      amount: price,
      stripeSessionId: stripeSession.id,
      status: "pending",
      paymentDate: new Date(),
    });

    await payment.save();

    // 6. Return success response with caching headers
    return NextResponse.json(
      { url: stripeSession.url },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800", // Cache for 1 hour
        },
      }
    );
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed", details: error.message },
      { status: 500, headers: { "Cache-Control": "no-store" } } // No caching for errors
    );
  }
}

// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { getServerSession } from "next-auth";
// import { options } from "../auth/[...nextauth]/options";
// import Payment from "@/models/Payment";
// import { connectDB } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import * as Sentry from "@sentry/node"; // Use the server-side SDK

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   const transaction = Sentry.startTransaction({
//     op: "paymentProcessing",
//     name: "Process Payment",
//   });

//   try {
//     // 1. Connect to DB and check authentication
//     await connectDB();
//     const session = await getServerSession(options);

//     if (!session || !session.user) {
//       Sentry.captureMessage("Unauthorized payment attempt");
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401, headers: { "Cache-Control": "no-store" } }
//       );
//     }

//     // 2. Get request data
//     const { productId, price, title } = await req.json();

//     // 3. Validate required fields
//     if (!productId || !price || !title) {
//       Sentry.captureMessage("Missing required fields in payment request");
//       return NextResponse.json(
//         { error: "Product ID, price, and title are required" },
//         { status: 400, headers: { "Cache-Control": "no-store" } }
//       );
//     }

//     // Validate price is a positive number
//     if (typeof price !== "number" || price <= 0) {
//       Sentry.captureMessage("Invalid price value");
//       return NextResponse.json(
//         { error: "Price must be a positive number" },
//         { status: 400, headers: { "Cache-Control": "no-store" } }
//       );
//     }

//     // 4. Create Stripe session
//     const stripeSession = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: title,
//             },
//             unit_amount: Math.round(price * 100), // Convert to cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
//       metadata: {
//         userId: session.user.id,
//         productId: productId,
//         productName: title,
//       },
//     });

//     // 5. Create payment record
//     const payment = new Payment({
//       userId: new ObjectId(session.user.id),
//       productId: productId,
//       productName: title,
//       amount: price,
//       stripeSessionId: stripeSession.id,
//       status: "pending",
//       paymentDate: new Date(),
//     });

//     await payment.save();

//     Sentry.addBreadcrumb({
//       category: "payment",
//       message: `Payment session created for user ${session.user.id}`,
//       level: Sentry.Severity.Info,
//     });

//     // 6. Return success response
//     return NextResponse.json(
//       { url: stripeSession.url },
//       {
//         headers: {
//           "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
//         },
//       }
//     );
//   } catch (error) {
//     Sentry.captureException(error, {
//       tags: { route: "POST /api/create-payment" },
//       extra: { session: session?.user },
//     });
//     return NextResponse.json(
//       { error: "Payment initialization failed", details: error.message },
//       { status: 500, headers: { "Cache-Control": "no-store" } }
//     );
//   } finally {
//     transaction.finish();
//   }
// }

// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { getServerSession } from "next-auth";
// import { options } from "../auth/[...nextauth]/options";
// import Payment from "@/models/Payment";
// import { connectDB } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import * as Sentry from "@sentry/nextjs";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   const transaction = Sentry.startTransaction({
//     op: "paymentProcessing",
//     name: "Process Payment",
//   });

//   try {
//     // 1. Connect to DB and check authentication
//     await connectDB();
//     const session = await getServerSession(options);

//     if (!session || !session.user) {
//       Sentry.captureMessage("Unauthorized payment attempt");
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401, headers: { "Cache-Control": "no-store" } }
//       );
//     }

//     // 2. Get request data
//     const { productId, price, title } = await req.json();

//     // 3. Validate required fields
//     if (!productId || !price || !title) {
//       Sentry.captureMessage("Missing required fields in payment request");
//       return NextResponse.json(
//         { error: "Product ID, price, and title are required" },
//         { status: 400, headers: { "Cache-Control": "no-store" } }
//       );
//     }

//     // 4. Create Stripe session
//     const stripeSession = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: title,
//             },
//             unit_amount: Math.round(price * 100),
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
//       metadata: {
//         userId: session.user.id,
//         productId: productId,
//         productName: title,
//       },
//     });

//     // 5. Create payment record
//     const payment = new Payment({
//       userId: new ObjectId(session.user.id),
//       productId: productId,
//       productName: title,
//       amount: price,
//       stripeSessionId: stripeSession.id,
//       status: "pending",
//       paymentDate: new Date(),
//     });

//     await payment.save();

//     Sentry.addBreadcrumb({
//       category: "payment",
//       message: `Payment session created for user ${session.user.id}`,
//       level: Sentry.Severity.Info,
//     });

//     // 6. Return success response
//     return NextResponse.json(
//       { url: stripeSession.url },
//       {
//         headers: {
//           "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
//         },
//       }
//     );
//   } catch (error) {
//     Sentry.captureException(error, {
//       tags: { route: "POST /api/payment" },
//       extra: { session: session?.user },
//     });
//     return NextResponse.json(
//       { error: "Payment initialization failed", details: error.message },
//       { status: 500, headers: { "Cache-Control": "no-store" } }
//     );
//   } finally {
//     transaction.finish();
//   }
// }

// app/api/create-payment/route.js
// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { getServerSession } from "next-auth";
// import { options } from "../auth/[...nextauth]/options";
// import Payment from "@/models/Payment";
// import { connectDB } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import * as Sentry from "@sentry/node"; // Use the server-side SDK

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   const transaction = Sentry.startTransaction({
//     op: "paymentProcessing",
//     name: "Process Payment",
//   });

//   try {
//     // 1. Connect to DB and check authentication
//     await connectDB();
//     const session = await getServerSession(options);

//     if (!session || !session.user) {
//       Sentry.captureMessage("Unauthorized payment attempt");
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401, headers: { "Cache-Control": "no-store" } }
//       );
//     }

//     // 2. Get request data
//     const { productId, price, title } = await req.json();

//     // 3. Validate required fields
//     if (!productId || !price || !title) {
//       Sentry.captureMessage("Missing required fields in payment request");
//       return NextResponse.json(
//         { error: "Product ID, price, and title are required" },
//         { status: 400, headers: { "Cache-Control": "no-store" } }
//       );
//     }

//     // 4. Create Stripe session
//     const stripeSession = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: title,
//             },
//             unit_amount: Math.round(price * 100),
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
//       metadata: {
//         userId: session.user.id,
//         productId: productId,
//         productName: title,
//       },
//     });

//     // 5. Create payment record
//     const payment = new Payment({
//       userId: new ObjectId(session.user.id),
//       productId: productId,
//       productName: title,
//       amount: price,
//       stripeSessionId: stripeSession.id,
//       status: "pending",
//       paymentDate: new Date(),
//     });

//     await payment.save();

//     Sentry.addBreadcrumb({
//       category: "payment",
//       message: `Payment session created for user ${session.user.id}`,
//       level: Sentry.Severity.Info,
//     });

//     // 6. Return success response
//     return NextResponse.json(
//       { url: stripeSession.url },
//       {
//         headers: {
//           "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
//         },
//       }
//     );
//   } catch (error) {
//     Sentry.captureException(error, {
//       tags: { route: "POST /api/create-payment" },
//       extra: { session: session?.user },
//     });
//     return NextResponse.json(
//       { error: "Payment initialization failed", details: error.message },
//       { status: 500, headers: { "Cache-Control": "no-store" } }
//     );
//   } finally {
//     transaction.finish();
//   }
// }