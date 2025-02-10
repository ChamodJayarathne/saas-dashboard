
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import Payment from "@/models/Payment";
import { connectDB } from "@/lib/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get("stripe-signature");

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Update payment status in database
      await Payment.findOneAndUpdate(
        { stripeSessionId: session.id },
        { 
          $set: { 
            status: 'completed',
            stripePaymentIntentId: session.payment_intent
          } 
        }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}