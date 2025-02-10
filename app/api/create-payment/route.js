
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get request data
    const { productId, price, title } = await req.json();

    // 3. Validate required fields
    if (!productId || !price || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
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

    // 6. Return success response
    return NextResponse.json({ url: stripeSession.url });
    
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed", details: error.message },
      { status: 500 }
    );
  }
}

